import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const TOTAL_FRAMES = 192;
const FRAME_DIRECTORY = '/frames';

const pageFrameTargets = {
  '/': 1,
  '/about': 45,
  '/projects': 95,
  '/services': 135,
  '/contact': 180,
  '/admin/login': 1,
  '/admin/dashboard': 1
};

// Global image cache
const globalImageCache = {};
let isPreloadStarted = false;

// Preload frames progressively in the background without blocking main thread
function startGlobalPreload() {
  if (isPreloadStarted || typeof window === 'undefined') return;
  isPreloadStarted = true;

  let current = 1;
  const loadNext = () => {
    if (current > TOTAL_FRAMES) return;
    const paddedIndex = String(current).padStart(4, '0');
    if (!globalImageCache[paddedIndex]) {
      const img = new Image();
      img.onload = () => {
        globalImageCache[paddedIndex] = img;
        current++;
        setTimeout(loadNext, 20);
      };
      img.onerror = () => {
        current++;
        setTimeout(loadNext, 20);
      };
      img.src = `${FRAME_DIRECTORY}/frame_${paddedIndex}.png`;
    } else {
      current++;
      loadNext();
    }
  };

  loadNext();
}

export default function CanvasAnimation({ currentPath }) {
  const router = useRouter();
  const activePath = currentPath || (router ? router.pathname : '/');
  const canvasRef = useRef(null);
  const lastDrawnImgRef = useRef(null);

  const stateRef = useRef({
    currentFrame: pageFrameTargets[activePath] || 1,
    targetFrame: pageFrameTargets[activePath] || 1,
    animFrameId: null,
  });

  useEffect(() => {
    const target = pageFrameTargets[activePath] || 1;
    stateRef.current.targetFrame = target;
  }, [activePath]);

  useEffect(() => {
    startGlobalPreload();

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

    // Find closest loaded image to avoid black flashes
    const getBestAvailableImage = (targetIndex) => {
      const targetPadded = String(targetIndex).padStart(4, '0');
      if (globalImageCache[targetPadded] && globalImageCache[targetPadded].complete) {
        return globalImageCache[targetPadded];
      }

      // Search outwards for nearest loaded frame
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prevIdx = Math.max(1, targetIndex - delta);
        const prevPadded = String(prevIdx).padStart(4, '0');
        if (globalImageCache[prevPadded] && globalImageCache[prevPadded].complete) {
          return globalImageCache[prevPadded];
        }

        const nextIdx = Math.min(TOTAL_FRAMES, targetIndex + delta);
        const nextPadded = String(nextIdx).padStart(4, '0');
        if (globalImageCache[nextPadded] && globalImageCache[nextPadded].complete) {
          return globalImageCache[nextPadded];
        }
      }

      return lastDrawnImgRef.current;
    };

    const renderFrame = (frameIndex) => {
      if (!ctx || !canvas) return;
      const index = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
      const img = getBestAvailableImage(index);

      if (!img || !img.complete || img.naturalWidth === 0) {
        // If no image is available at all, keep previous canvas content without wiping to black
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

    // Load target frame immediately for active path
    const initialFrame = Math.round(stateRef.current.currentFrame);
    const initialPadded = String(initialFrame).padStart(4, '0');
    if (!globalImageCache[initialPadded]) {
      const img = new Image();
      img.onload = () => {
        globalImageCache[initialPadded] = img;
        renderFrame(initialFrame);
      };
      img.src = `${FRAME_DIRECTORY}/frame_${initialPadded}.png`;
    }

    const animate = () => {
      const { targetFrame, currentFrame } = stateRef.current;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        stateRef.current.currentFrame += diff * 0.15;
        renderFrame(stateRef.current.currentFrame);
      } else {
        stateRef.current.currentFrame = targetFrame;
        renderFrame(stateRef.current.currentFrame);
      }
      stateRef.current.animFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.max(0, Math.min(1, scrollY / maxScroll));
      const baseFrame = pageFrameTargets[activePath] || 1;
      const scrubFrames = 35;
      const targetFrame = Math.round(baseFrame + scrollRatio * scrubFrames);
      stateRef.current.targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, targetFrame));
    };

    const handleResize = () => {
      updateCanvasSize();
      renderFrame(stateRef.current.currentFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    stateRef.current.animFrameId = requestAnimationFrame(animate);

    renderFrame(stateRef.current.currentFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.animFrameId) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }
    };
  }, [activePath]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }} 
    />
  );
}
