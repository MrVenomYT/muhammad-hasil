import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const TOTAL_FRAMES = 192;
const FRAME_DIR = '/frames';

// Route base frame targets for page transitions
const pageFrameTargets = {
  '/': 0,
  '/about': 44,
  '/projects': 94,
  '/services': 134,
  '/contact': 159,
  '/admin/login': 0,
  '/admin/dashboard': 0
};

// Global in-memory cache for all 192 image frames
const frameImagesCache = new Array(TOTAL_FRAMES);
let isPreloadStarted = false;

// Preload all 192 keyframes in parallel streams for instantaneous access
function initializeFramePreloader(activeStart = 0) {
  if (isPreloadStarted || typeof window === 'undefined') return;
  isPreloadStarted = true;

  // Build loading order starting from active page frame outward
  const indices = [];
  for (let f = activeStart; f < TOTAL_FRAMES; f++) indices.push(f);
  for (let f = 0; f < activeStart; f++) indices.push(f);

  const loadFrame = (index) => {
    return new Promise((resolve) => {
      const img = new Image();
      const paddedStr = String(index + 1).padStart(4, '0');
      img.onload = () => {
        frameImagesCache[index] = img;
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = `${FRAME_DIR}/frame_${paddedStr}.png`;
    });
  };

  // High-throughput parallel batches of 16
  const batchSize = 16;
  let offset = 0;

  const processBatches = () => {
    if (offset >= indices.length) return;
    const currentBatch = indices.slice(offset, offset + batchSize);
    offset += batchSize;

    Promise.all(currentBatch.map(loadFrame)).then(() => {
      if (typeof window !== 'undefined') {
        setTimeout(processBatches, 10);
      }
    });
  };

  processBatches();
}

export default function CanvasAnimation({ currentPath }) {
  const router = useRouter();
  const activePath = currentPath || (router ? router.pathname : '/');
  const canvasRef = useRef(null);
  const lastDrawnImgRef = useRef(null);

  const startFrame = pageFrameTargets[activePath] !== undefined ? pageFrameTargets[activePath] : 0;

  const animState = useRef({
    currentFrame: startFrame,
    targetFrame: startFrame,
    renderedFrame: -1,
    reqId: null
  });

  useEffect(() => {
    initializeFramePreloader(startFrame);
  }, [startFrame]);

  useEffect(() => {
    const baseTarget = pageFrameTargets[activePath] !== undefined ? pageFrameTargets[activePath] : 0;
    animState.current.targetFrame = baseTarget;
  }, [activePath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    };

    resizeCanvas();

    // Find nearest loaded frame to guarantee zero black flashes
    const getBestAvailableImage = (targetIndex) => {
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetIndex)));
      if (frameImagesCache[idx] && frameImagesCache[idx].complete && frameImagesCache[idx].naturalWidth > 0) {
        return frameImagesCache[idx];
      }

      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const left = Math.max(0, idx - delta);
        if (frameImagesCache[left] && frameImagesCache[left].complete && frameImagesCache[left].naturalWidth > 0) {
          return frameImagesCache[left];
        }

        const right = Math.min(TOTAL_FRAMES - 1, idx + delta);
        if (frameImagesCache[right] && frameImagesCache[right].complete && frameImagesCache[right].naturalWidth > 0) {
          return frameImagesCache[right];
        }
      }

      return lastDrawnImgRef.current;
    };

    const renderCanvas = (frameVal) => {
      if (!canvas || !ctx) return;

      const img = getBestAvailableImage(frameVal);

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

      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      ctx.fillStyle = '#070605';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    // Native requestAnimationFrame smooth lerp loop
    const tick = () => {
      const { targetFrame, currentFrame } = animState.current;
      const diff = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.001) {
        // Fluid lerp dampening for 60fps/120fps screens
        animState.current.currentFrame += diff * 0.14;
        const integerFrame = Math.round(animState.current.currentFrame);
        
        if (integerFrame !== animState.current.renderedFrame) {
          animState.current.renderedFrame = integerFrame;
          renderCanvas(animState.current.currentFrame);
        }
      } else {
        animState.current.currentFrame = targetFrame;
        const integerFrame = Math.round(targetFrame);
        if (integerFrame !== animState.current.renderedFrame) {
          animState.current.renderedFrame = integerFrame;
          renderCanvas(targetFrame);
        }
      }

      animState.current.reqId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      const winHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, docHeight - winHeight);

      const scrollPercent = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      const pageStart = pageFrameTargets[activePath] !== undefined ? pageFrameTargets[activePath] : 0;
      const frameSpan = (TOTAL_FRAMES - 1) - pageStart;
      
      const computedTarget = pageStart + (scrollPercent * frameSpan);
      animState.current.targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, computedTarget));
    };

    const handleResize = () => {
      resizeCanvas();
      renderCanvas(animState.current.currentFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    animState.current.reqId = requestAnimationFrame(tick);
    renderCanvas(animState.current.currentFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animState.current.reqId) {
        cancelAnimationFrame(animState.current.reqId);
      }
    };
  }, [activePath]);

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
