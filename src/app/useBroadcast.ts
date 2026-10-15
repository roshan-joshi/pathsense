import { useEffect } from 'react';
import type { Engine, EngineState } from '../timeline/engine';

/** Keeps an optional second-screen presenter view (#/presenter-view) in sync via BroadcastChannel. */
export function useBroadcast(engine: Engine, state: EngineState, presenter: boolean) {
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel('pathsense-presenter');
    const onMsg = (e: MessageEvent) => {
      const m = e.data as { cmd: string; value?: number };
      switch (m.cmd) {
        case 'toggle': engine.toggle(); break;
        case 'next': engine.next(); break;
        case 'prev': engine.prev(); break;
        case 'jump': engine.jumpTo(m.value ?? 0); break;
        case 'restart': engine.restart(); break;
        case 'hello': ch.postMessage({ type: 'state', state: engine.state, presenter }); break;
      }
    };
    ch.addEventListener('message', onMsg);
    return () => { ch.removeEventListener('message', onMsg); ch.close(); };
  }, [engine, presenter]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel('pathsense-presenter');
    ch.postMessage({ type: 'state', state, presenter });
    ch.close();
  }, [state, presenter]);
}
