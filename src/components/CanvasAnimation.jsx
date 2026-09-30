import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const TOTAL_FRAMES = 192;
const FRAME_DIR = '/frames';

// Route base frame targets for page transitions
const pageFrameTargets = {
  '/': 0,
  '/about': 35,
  '/projects': 70,
  '/products': 95,
  '/services': 120,
  '/contact': 150,
  '/faq': 60,
  '/privacy': 130,
  '/admin/login': 20,
  '/admin/dashboard': 45
};

// Global in-memory cache for all 192 image frames
const frameImagesCache = new Array(TOTAL_FRAMES);
let isPreloadStarted = false;

// Load a single frame image into cache safely
function loadFrame(index, onLoaded) {
  if (frameImagesCache[index]) return;
  const img = new Image();
  const paddedStr = String(index + 1).padStart(4, '0');
  img.src = `${FRAME_DIR}/frame_${paddedStr}.png`;
  img.onload = () => {
    frameImagesCache[index] = img;
    if (onLoaded) onLoaded(index, img);
  };
}

// 3-Tier Progressive Preloader: Instant Load (<50ms) -> Keyframe Steps -> Idle Background Fill
function initializeFramePreloader(initialFrame = 0, onInitialFrameReady) {
  if (typeof window === 'undefined') return;

  // Tier 1: Immediately load target initial frame & key route targets
  loadFrame(initialFrame, () => {
    if (onInitialFrameReady) onInitialFrameReady();
  });
  
  const keyRouteFrames = [0, 40, 80, 120, 160];
  keyRouteFrames.forEach(idx => loadFrame(idx));

  if (isPreloadStarted) return;
  isPreloadStarted = true;

  // Tier 2: Load keyframe steps (every 3rd frame) for instant smooth scroll coverage
  const stepIndices = [];
  for (let i = 0; i < TOTAL_FRAMES; i += 3) {
    stepIndices.push(i);
  }

  let stepIdx = 0;
  function loadNextStepBatch() {
    const end = Math.min(stepIndices.length, stepIdx + 6);
    for (let i = stepIdx; i < end; i++) {
      loadFrame(stepIndices[i]);
    }
    stepIdx = end;
    if (stepIdx < stepIndices.length) {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(loadNextStepBatch);
      } else {
        setTimeout(loadNextStepBatch, 30);
      }
    } else {
      // Tier 3: Fill in remaining frame gaps in idle background batches
      loadRemainingFrames();
    }
  }

  function loadRemainingFrames() {
    let currentIdx = 0;
    function loadNextRemainingBatch() {
      let count = 0;
      while (currentIdx < TOTAL_FRAMES && count < 4) {
        if (!frameImagesCache[currentIdx]) {
          loadFrame(currentIdx);
          count++;
        }
        currentIdx++;
      }
      if (currentIdx < TOTAL_FRAMES) {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(loadNextRemainingBatch);
        } else {
          setTimeout(loadNextRemainingBatch, 40);
        }
      }
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadNextRemainingBatch);
    } else {
      setTimeout(loadNextRemainingBatch, 60);
    }
  }

  // Start Tier 2 steps after short delay so main UI thread is completely unblocked
  setTimeout(loadNextStepBatch, 100);
}

export default function CanvasAnimation({ currentPath = '/' }) {
  let activePath = currentPath || '/';
  try {
    const router = useRouter();
    if (router?.pathname) {
      activePath = router.pathname;
    }
  } catch (e) {
    // Safe fallback during SSG
  }
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
    initializeFramePreloader(startFrame, () => {
      // Force initial render as soon as initial frame is ready
      if (animState.current) {
        animState.current.renderedFrame = -1;
      }
    });
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
      ctx.imageSmoothingQuality = 'high';
    };

    resizeCanvas();

    // Get best available image (exact frame or nearest loaded frame)
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
      if (!img || !img.complete || img.naturalWidth === 0) return;

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

      ctx.fillStyle = '#0d0806';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    // Ultra-smooth 60fps frame tick loop with smooth LERP momentum
    const tick = () => {
      const { targetFrame, currentFrame } = animState.current;
      const diff = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.01) {
        // Smooth LERP step calculation for silky smooth scroll tracking
        const step = Math.sign(diff) * Math.min(Math.abs(diff) * 0.16 + 0.02, Math.abs(diff));
        animState.current.currentFrame += step;

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

    const handleScroll = (e) => {
      let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      let docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      let winHeight = window.innerHeight || 1;

      if (e && e.target && e.target !== document && e.target !== window && e.target.scrollHeight > e.target.clientHeight) {
        scrollY = e.target.scrollTop || 0;
        docHeight = e.target.scrollHeight || 1;
        winHeight = e.target.clientHeight || 1;
      }

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

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleResize, { passive: true });

    animState.current.reqId = requestAnimationFrame(tick);
    renderCanvas(animState.current.currentFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.removeEventListener('scroll', handleScroll, { capture: true });
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

