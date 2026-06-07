"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    function move(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }

    function over(event) {
      setActive(Boolean(event.target.closest("a, button, input, textarea, select, [data-cursor='interactive']")));
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-5 w-5 rounded-full border border-gold/70 mix-blend-screen transition-[height,width,opacity] duration-200 md:block"
        style={{
          opacity: position.x < 0 ? 0 : 1,
          transform: `translate3d(${position.x - (active ? 18 : 10)}px, ${position.y - (active ? 18 : 10)}px, 0)`,
          width: active ? 36 : 20,
          height: active ? 36 : 20
        }}
      />
      <div
        className="pointer-events-none fixed left-0 top-0 z-[89] hidden h-56 w-56 rounded-full bg-gold/10 blur-3xl transition-opacity duration-300 md:block"
        style={{
          opacity: position.x < 0 ? 0 : active ? 0.34 : 0.18,
          transform: `translate3d(${position.x - 112}px, ${position.y - 112}px, 0)`
        }}
      />
    </>
  );
}
