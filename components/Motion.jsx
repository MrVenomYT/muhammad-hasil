"use client";

import React from "react";

const ignoredMotionProps = new Set([
  "animate",
  "exit",
  "initial",
  "layout",
  "transition",
  "viewport",
  "whileHover",
  "whileInView",
  "whileTap"
]);

const componentCache = new Map();

function stripMotionProps(props) {
  const next = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!ignoredMotionProps.has(key)) next[key] = value;
  });
  return next;
}

export const motion = new Proxy({}, {
  get(_, tag) {
    if (componentCache.has(tag)) return componentCache.get(tag);

    const Component = React.forwardRef(function MotionElement(props, ref) {
      return React.createElement(tag, { ...stripMotionProps(props), ref });
    });
    Component.displayName = `motion.${String(tag)}`;
    componentCache.set(tag, Component);
    return Component;
  }
});

export function AnimatePresence({ children }) {
  return <>{children}</>;
}
