"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function GlobalScrollSmoother() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest<HTMLElement>(
        "[data-lenis-start], [data-lenis-stop], [data-lenis-toggle]",
      );
      if (!trigger) return;

      if (trigger.hasAttribute("data-lenis-start")) {
        lenis.start();
        trigger.classList.remove("stop-scroll");
        return;
      }
      if (trigger.hasAttribute("data-lenis-stop")) {
        lenis.stop();
        trigger.classList.add("stop-scroll");
        return;
      }
      if (trigger.hasAttribute("data-lenis-toggle")) {
        const shouldStop = !trigger.classList.contains("stop-scroll");
        trigger.classList.toggle("stop-scroll", shouldStop);
        if (shouldStop) lenis.stop();
        else lenis.start();
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

