import gsap from 'gsap';

/**
 * Small, deterministic motion vocabulary shared by every scene.
 * When `reduced` is true, movement collapses to opacity changes.
 */
export interface Fx {
  reduced: boolean;
  /** Fade + rise in. */
  reveal(tl: gsap.core.Timeline, targets: gsap.TweenTarget, at: number, o?: { y?: number; x?: number; d?: number; stagger?: number; scale?: number }): void;
  /** Fade + drift out. */
  hide(tl: gsap.core.Timeline, targets: gsap.TweenTarget, at: number, o?: { y?: number; d?: number; stagger?: number }): void;
  /** Slow cinematic push-in on an image layer between two scales over a span. */
  push(tl: gsap.core.Timeline, target: gsap.TweenTarget, at: number, o: { from?: number; to: number; d: number; x?: number; y?: number }): void;
  /** Draw an SVG path (requires stroke-dasharray set up via drawPrep). */
  draw(tl: gsap.core.Timeline, target: gsap.TweenTarget, at: number, d?: number): void;
  /** Soft light wipe used for chapter openings. */
  lightIn(tl: gsap.core.Timeline, veil: gsap.TweenTarget, at: number, d?: number): void;
  lightOut(tl: gsap.core.Timeline, veil: gsap.TweenTarget, at: number, d?: number): void;
}

export function makeFx(reduced: boolean): Fx {
  const E = 'power3.out';
  return {
    reduced,
    reveal(tl, t, at, o = {}) {
      const d = o.d ?? 0.9;
      tl.fromTo(t, { autoAlpha: 0, y: reduced ? 0 : (o.y ?? 24), x: reduced ? 0 : (o.x ?? 0), scale: reduced ? 1 : (o.scale ?? 1) }, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: d, ease: E, stagger: o.stagger ?? 0 }, at);
    },
    hide(tl, t, at, o = {}) {
      tl.to(t, { autoAlpha: 0, y: reduced ? 0 : (o.y ?? -14), duration: o.d ?? 0.6, ease: 'power2.inOut', stagger: o.stagger ?? 0 }, at);
    },
    push(tl, t, at, o) {
      if (reduced) { tl.set(t, { scale: 1, x: 0, y: 0 }, at); return; }
      tl.fromTo(t, { scale: o.from ?? 1, x: 0, y: 0 }, { scale: o.to, x: o.x ?? 0, y: o.y ?? 0, duration: o.d, ease: 'none' }, at);
    },
    draw(tl, t, at, d = 1.2) {
      tl.fromTo(t, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: reduced ? 0.01 : d, ease: 'power2.inOut' }, at);
    },
    lightIn(tl, veil, at, d = 1.6) { tl.fromTo(veil, { autoAlpha: 1 }, { autoAlpha: 0, duration: reduced ? 0.4 : d, ease: 'power2.out' }, at); },
    lightOut(tl, veil, at, d = 1.2) { tl.to(veil, { autoAlpha: 1, duration: reduced ? 0.4 : d, ease: 'power2.in' }, at); },
  };
}

/** Prepare SVG paths for stroke drawing with normalised dash values. */
export function drawPrep(paths: NodeListOf<Element> | Element[]) {
  paths.forEach((p) => {
    const el = p as SVGPathElement;
    el.style.strokeDasharray = '1'; el.style.strokeDashoffset = '1';
    (el.style as unknown as { pathLength?: string }).pathLength = '1';
    el.setAttribute('pathLength', '1');
  });
}

/** Human readable mm:ss */
export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
