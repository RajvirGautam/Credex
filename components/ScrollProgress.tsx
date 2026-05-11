"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const root = document.documentElement;
        const max = root.scrollHeight - root.clientHeight;
        const p = max > 0 ? root.scrollTop / max : 0;
        el.style.transform = `scaleX(${p})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
