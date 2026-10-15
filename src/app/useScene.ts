import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useEngine } from './EngineContext';
import { makeFx, type Fx } from '../timeline/fx';
import type { ChapterId } from '../content/story';

/**
 * Builds a paused GSAP timeline for a chapter from its root element and registers it with the engine.
 * The builder receives a gsap context-scoped selector `q` and the motion helpers `fx`.
 */
export function useScene(id: ChapterId, build: (ctx: { root: HTMLElement; q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) => void, reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useEngine();
  useLayoutEffect(() => {
    const root = ref.current!;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
      build({ root, q: gsap.utils.selector(root), tl, fx: makeFx(reduced) });
      engine.registerTimeline(id, tl);
    }, root);
    return () => { engine.unregisterTimeline(id); ctx.revert(); };
  }, [engine, id, reduced, build]);
  return ref;
}
