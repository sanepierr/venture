"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", () => {
      // Scroll listener for Lenis
    });

    function handleHashLink(e: HashChangeEvent | PopStateEvent) {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -80 });
        }
      }
    }

    window.addEventListener("hashchange", handleHashLink);
    window.addEventListener("popstate", handleHashLink);

    setTimeout(handleHashLink, 100);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.removeEventListener("hashchange", handleHashLink);
      window.removeEventListener("popstate", handleHashLink);
    };
  }, []);
  return <>{children}</>;
}
