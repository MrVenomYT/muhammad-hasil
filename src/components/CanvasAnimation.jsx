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

export default function CanvasAnimation({ currentPath }) {
  const router = useRouter();
  const activePath = currentPath || (router ? router.pathname : '/');
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const updateCanvasSize = () => {
      if (!canvas || !ctx) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    updateCanvasSize();

    const renderFrame = (frameIndex) => {
      if (!ctx || !canvas) return;
      const index = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex))) - 1;
      const img = imagesRef.current[index];
      
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Clear background
      ctx.fillStyle = '#070605';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!img || !img.complete || img.naturalWidth === 0) return;

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

      ctx.drawImage(img, offsetPx, offsetPy, drawW, drawH);
    };

    // Load all 192 frame images immediately
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!imagesRef.current[i - 1]) {
        const img = new Image();
        const paddedIndex = String(i).padStart(4, '0');
        img.onload = () => {
          if (Math.round(stateRef.current.currentFrame) === i) {
            renderFrame(i);
          }
        };
        img.src = `${FRAME_DIRECTORY}/frame_${paddedIndex}.png`;
        imagesRef.current[i - 1] = img;
      }
    }

    const animate = () => {
      const { targetFrame, currentFrame } = stateRef.current;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        stateRef.current.currentFrame += diff * 0.15;
      } else {
        stateRef.current.currentFrame = targetFrame;
      }
      renderFrame(stateRef.current.currentFrame);
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
    window.addEventListener('resize', handleResize);
    stateRef.current.animFrameId = requestAnimationFrame(animate);

    // Initial render call
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
    <>
      <canvas 
        ref={canvasRef} 
        id="animation-canvas" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          pointerEvents: 'none',
          backgroundColor: '#070605'
        }}
      />
      <div 
        className="bg-vignette-overlay" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at center, transparent 30%, rgba(7, 6, 5, 0.75) 100%)'
        }}
      />
    </>
  );
}
