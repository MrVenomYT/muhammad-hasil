import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const TOTAL_FRAMES = 192;
const FRAME_DIRECTORY = '/frames';

const pageStartFrames = {
  '/': 1,
  '/about': 45,
  '/projects': 95,
  '/services': 135,
  '/contact': 160,
  '/admin/login': 1,
  '/admin/dashboard': 1
};

// Global in-memory image cache for all 192 keyframes
const globalImageCache = {};
let isGlobalPreloadInitiated = false;

function fetchSingleFrame(i) {
  const paddedIndex = String(i).padStart(4, '0');
  if (globalImageCache[i] && globalImageCache[i].complete) {
    return Promise.resolve(globalImageCache[i]);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      globalImageCache[i] = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = `${FRAME_DIRECTORY}/frame_${paddedIndex}.png`;
  });
}

// Rapid parallel stream for all 192 frames
function preloadAllFrames(startFrame = 1) {
  if (typeof window === 'undefined') return;

  const frameOrder = [];
  // Prioritize active page target first
  for (let f = startFrame; f <= TOTAL_FRAMES; f++) {
    frameOrder.push(f);
  }
  for (let f = 1; f < startFrame; f++) {
    frameOrder.push(f);
  }

  const batchSize = 16;
  let offset = 0;

  const processBatch = () => {
    if (offset >= frameOrder.length) return;
    const batch = frameOrder.slice(offset, offset + batchSize);
    offset += batchSize;

    Promise.all(batch.map(f => fetchSingleFrame(f))).then(() => {
      if (typeof window !== 'undefined') {
        setTimeout(processBatch, 10);
      }
    });
  };

  processBatch();
}

export default function CanvasAnimation({ currentPath }) {
  const router = useRouter();
  const activePath = currentPath || (router ? router.pathname : '/');
  const canvasRef = useRef(null);
  const lastDrawnImgRef = useRef(null);

  const startFrameForPath = pageStartFrames[activePath] || 1;

  const stateRef = useRef({
    currentFrame: startFrameForPath,
    targetFrame: startFrameForPath,
    animFrameId: null,
  });

  useEffect(() => {
    const target = pageStartFrames[activePath] || 1;
    stateRef.current.targetFrame = target;
    preloadAllFrames(target);
  }, [activePath]);

  useEffect(() => {
    if (!isGlobalPreloadInitiated) {
      isGlobalPreloadInitiated = true;
      preloadAllFrames(startFrameForPath);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const updateCanvasSize = () => {
      if (!canvas || !ctx) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    };

    updateCanvasSize();

    // Get closest available image to ensure 0 flickering
    const getBestAvailableImage = (targetIndex) => {
      const idx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIndex)));
      if (globalImageCache[idx] && globalImageCache[idx].complete && globalImageCache[idx].naturalWidth > 0) {
        return globalImageCache[idx];
      }

      // Search outward for nearest loaded frame
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prevIdx = Math.max(1, idx - delta);
        if (globalImageCache[prevIdx] && globalImageCache[prevIdx].complete && globalImageCache[prevIdx].naturalWidth > 0) {
          return globalImageCache[prevIdx];
        }

        const nextIdx = Math.min(TOTAL_FRAMES, idx + delta);
        if (globalImageCache[nextIdx] && globalImageCache[nextIdx].complete && globalImageCache[nextIdx].naturalWidth > 0) {
          return globalImageCache[nextIdx];
        }
      }

      return lastDrawnImgRef.current;
    };

    const renderFrame = (frameIndex) => {
      if (!ctx || !canvas) return;
      const img = getBestAvailableImage(frameIndex);

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      lastDrawnImgRef.current = img;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
      const imgRatio = imgW / imgH;
      const viewportRatio = vw / vh;

      let drawW, drawH;
      if (viewportRatio > imgRatio) {
        drawW = vw * dpr;
        drawH = (vw / imgRatio) * dpr;
      } else {
        drawH = vh * dpr;
        drawW = (vh * imgRatio) * dpr;
      }

      const offsetPx = (canvas.width - drawW) / 2;
      const offsetPy = (canvas.height - drawH) / 2;

      ctx.fillStyle = '#070605';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetPx, offsetPy, drawW, drawH);
    };

    // Render initial frame
    fetchSingleFrame(startFrameForPath).then(() => renderFrame(startFrameForPath));

    const animate = () => {
      const { targetFrame, currentFrame } = stateRef.current;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        stateRef.current.currentFrame += diff * 0.28;
        renderFrame(stateRef.current.currentFrame);
      } else {
        stateRef.current.currentFrame = targetFrame;
        renderFrame(stateRef.current.currentFrame);
      }
      stateRef.current.animFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      const startF = pageStartFrames[activePath] || 1;
      const availableSpan = TOTAL_FRAMES - startF;
      const targetFrame = Math.round(startF + scrollRatio * availableSpan);
      stateRef.current.targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, targetFrame));
    };

    const handleResize = () => {
      updateCanvasSize();
      renderFrame(stateRef.current.currentFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    stateRef.current.animFrameId = requestAnimationFrame(animate);

    renderFrame(stateRef.current.currentFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.animFrameId) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }
    };
  }, [activePath, startFrameForPath]);

  return (
    <canvas 
      ref={canvasRef}
      id="animation-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block'
      }} 
    />
  );
}
