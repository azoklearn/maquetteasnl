"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

type ScrollAnimation =
  | "none"
  | "scaleDown"
  | "rotate"
  | "gallery"
  | "catch"
  | "opacity"
  | "fixed"
  | "parallax";

interface PageScrollEffectsProps {
  animation?: ScrollAnimation;
  hijacking?: boolean;
  sections: React.ReactNode[];
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function PageScrollEffects({
  animation = "scaleDown",
  hijacking = false,
  sections,
}: PageScrollEffectsProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);
  const normalizedAnimation = useMemo<ScrollAnimation>(() => {
    if (animation === "rotate" || animation === "gallery" || animation === "catch") {
      return "scaleDown";
    }
    return animation;
  }, [animation]);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.history.scrollRestoration = "manual";
      } catch {
        // ignore unsupported browsers
      }
      window.scrollTo(0, 0);
    }

    document.body.dataset.hijacking = hijacking ? "on" : "off";
    document.body.dataset.animation = normalizedAnimation;

    const root = rootRef.current;
    if (!root) return;
    if (hijacking) {
      // Assure un démarrage propre sur la première section.
      root.scrollTop = 0;
    }
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(".cd-section"));
    if (!blocks.length) return;
    const getSectionOffsets = () => blocks.map((b) => b.offsetTop);

    const getCurrentIndex = () => {
      const offsets = getSectionOffsets();
      const y = getScrollTop();
      let index = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < offsets.length; i += 1) {
        const d = Math.abs(offsets[i] - y);
        if (d < bestDist) {
          bestDist = d;
          index = i;
        }
      }
      return index;
    };

    const goToSection = (nextIndex: number) => {
      const offsets = getSectionOffsets();
      const target = clamp(nextIndex, 0, offsets.length - 1);
      lockRef.current = true;
      root.scrollTo({ top: offsets[target], behavior: "smooth" });
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        lockRef.current = false;
      }, 650);
    };


    let rafId = 0;
    const getScrollTop = () =>
      hijacking ? (root.scrollTop || 0) : (window.scrollY || window.pageYOffset || 0);

    const update = () => {
      const vh = window.innerHeight || 1;
      const scrollTop = getScrollTop();
      blocks.forEach((block, index) => {
        const content = block.firstElementChild as HTMLElement | null;
        if (!content) return;

        const top = block.offsetTop - scrollTop;

        let progress = 0;
        if (top <= 0 && top >= -vh) progress = clamp(-top / vh, 0, 1);
        else if (top > 0 && top <= vh) progress = 0;
        else if (top < -vh) progress = 1;

        let opacity = 1;
        let scale = 1;
        let translateY = 0;
        let rotate = 0;
        let blur = 0;

        switch (normalizedAnimation) {
          case "opacity":
            opacity = 1 - progress;
            break;
          case "scaleDown":
            // Garde les sections à pleine largeur/hauteur pour éviter les bandes entre sections.
            scale = 1;
            opacity = 1;
            blur = 0;
            break;
          case "fixed":
          case "parallax":
            translateY = -progress * 12;
            opacity = 1 - progress * 0.75;
            scale = 1 - progress * 0.06;
            break;
          case "none":
          default:
            break;
        }

        if (index === 0 && scrollTop <= 2) {
          opacity = 1;
          scale = 1;
          translateY = 0;
          blur = 0;
        }

        content.style.opacity = `${clamp(opacity, 0, 1)}`;
        content.style.transform = `translate3d(0, ${translateY}%, 0) scale(${scale}) rotate(${rotate}deg)`;
        content.style.filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";
      });
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    const onWheel = (event: WheelEvent) => {
      if (!hijacking) return;
      event.preventDefault();
      if (lockRef.current) return;
      if (Math.abs(event.deltaY) < 10) return;
      const current = getCurrentIndex();
      const direction = event.deltaY > 0 ? 1 : -1;
      goToSection(current + direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!hijacking) return;
      const downKeys = ["ArrowDown", "PageDown", " "];
      const upKeys = ["ArrowUp", "PageUp"];
      if (!downKeys.includes(event.key) && !upKeys.includes(event.key)) return;
      event.preventDefault();
      if (lockRef.current) return;
      const current = getCurrentIndex();
      const direction = downKeys.includes(event.key) ? 1 : -1;
      goToSection(current + direction);
    };

    // Exécuter une frame plus tard pour éviter un état transitoire au chargement.
    requestAnimationFrame(() => {
      if (hijacking) root.scrollTop = 0;
      window.scrollTo(0, 0);
      update();
    });
    const lateReset = window.setTimeout(() => {
      if (hijacking) root.scrollTop = 0;
      window.scrollTo(0, 0);
      onScroll();
    }, 180);

    const onPageShow = () => {
      if (hijacking) root.scrollTop = 0;
      window.scrollTo(0, 0);
      onScroll();
    };

    const scrollTarget = hijacking ? root : window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    if (hijacking) {
      root.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKeyDown);
    }
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("resize", onScroll);
    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      if (hijacking) {
        root.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKeyDown);
      }
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(lateReset);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    };
  }, [hijacking, normalizedAnimation]);

  useEffect(() => {
    return () => {
      delete document.body.dataset.hijacking;
      delete document.body.dataset.animation;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={hijacking ? "cd-scroll-root cd-scroll-root--hijacking" : "cd-scroll-root"}
    >
      {sections.map((section, index) => (
        <section key={index} className={`cd-section ${index === 0 ? "visible" : ""}`}>
          <div className="cd-section-content">{section}</div>
        </section>
      ))}
    </div>
  );
}

