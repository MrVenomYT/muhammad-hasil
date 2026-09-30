import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics for fluid progress filling
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #ff5500 0%, #ff7700 50%, #ffaa00 100%)',
        boxShadow: '0 0 14px rgba(255, 119, 0, 0.85), 0 0 28px rgba(255, 119, 0, 0.45)',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    />
  );
}
