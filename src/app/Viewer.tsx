import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Engine, type EngineState } from '../timeline/engine';
import { EngineContext } from './EngineContext';
import { chapters, chapterStart } from '../content/story';
import { config } from '../content/config';
import { fmt } from '../timeline/fx';
import { Chapter1 } from '../scenes/Chapter1';
import { Chapter2 } from '../scenes/Chapter2';
import { Chapter3 } from '../scenes/Chapter3';
import { Chapter4 } from '../scenes/Chapter4';
import { Chapter5 } from '../scenes/Chapter5';
import { Chapter6 } from '../scenes/Chapter6';
import { Chapter7 } from '../scenes/Chapter7';
import { Captions } from '../components/Captions';
import { Controls } from '../components/Controls';
import { StartScreen } from '../components/StartScreen';
import { Simulation } from '../components/Simulation';
import { useBroadcast } from './useBroadcast';

const params = new URLSearchParams(location.search);
const RENDER = params.get('render') === '1';
const AUTOSTART = params.get('autostart') === '1';

declare global { interface Window { __pathsense?: { seek: (t: number) => Promise<void>; state: () => EngineState; total: number; chapters: { id: string; number: string; start: number; duration: number; title: string; notes: string[]; keyMessages: string[] }[]; ready: boolean } } }

export function Viewer() {
  const engine = useMemo(() => new Engine({ renderMode: RENDER, reducedMotion: params.get('reduced') === '1' ? true : undefined }), []);
  const [state, setState] = useState<EngineState>(engine.state);
  const [sim, setSim] = useState(false);
  const [idle, setIdle] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => engine.subscribe(setState), [engine]);
  useEffect(() => () => engine.destroy(), [engine]);

  // Fit the 1920x1080 stage into the available space.
  useEffect(() => {
    const el = wrapRef.current!;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(r.width / 1920, r.height / 1080));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Render-mode / automation hooks.
  useEffect(() => {
    window.__pathsense = {
      seek: (t) => { RENDER ? engine.renderAt(t) : engine.seek(t); return new Promise<void>((r) => { const t = window.setTimeout(r, 150); requestAnimationFrame(() => requestAnimationFrame(() => { window.clearTimeout(t); r(); })); }); },
      state: () => engine.state,
      total: engine.total,
      chapters: chapters.map((c) => ({ id: c.id, number: c.number, start: chapterStart(c.index), duration: c.duration, title: c.title, notes: c.notes, keyMessages: c.keyMessages })),
      ready: true,
    };
    if (RENDER) engine.renderAt(0);
    if (AUTOSTART) engine.start({ narration: params.get('narration') !== '0', captions: params.get('captions') !== '0' });
  }, [engine]);

  // Second-screen presenter view sync (notes live only in that separate window).
  useBroadcast(engine, state, false);

  // Auto-hide controls and cursor while playing and the pointer is idle.
  useEffect(() => {
    let t = 0;
    const wake = () => { setIdle(false); window.clearTimeout(t); t = window.setTimeout(() => { if (engine.state.playing && !sim) setIdle(true); }, 3200); };
    wake();
    window.addEventListener('mousemove', wake); window.addEventListener('keydown', wake); window.addEventListener('pointerdown', wake);
    return () => { window.clearTimeout(t); window.removeEventListener('mousemove', wake); window.removeEventListener('keydown', wake); window.removeEventListener('pointerdown', wake); };
  }, [engine, sim, state.playing]);

  const showToast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(null), 2600); }, []);
  useEffect(() => { if (state.audioBlocked && state.narration) showToast('The browser blocked audio. Press M twice or use the Narration button to retry.'); }, [state.audioBlocked, state.narration, showToast]);

  const toggleFullscreen = useCallback(() => {
    const el = viewerRef.current!;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => showToast('Fullscreen is not available here. Press F11 or use the browser menu.'));
  }, [showToast]);

  // Keyboard shortcuts (presenter + cinematic).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if (!state.started) return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); engine.toggle(); break;
        case 'ArrowRight': case 'PageDown': e.preventDefault(); engine.next(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); engine.prev(); break;
        case 'Home': e.preventDefault(); engine.seek(0); break;
        case 'r': case 'R': engine.restart(); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'm': case 'M': engine.setNarration(!engine.state.narration); break;
        case 'c': case 'C': engine.setCaptions(!engine.state.captions); break;
        case 't': case 'T': setSim(true); engine.pause(); break;
        case 'Escape': if (sim) setSim(false); break;
        default:
          if (/^[1-7]$/.test(e.key)) engine.jumpTo(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine, state.started, sim, toggleFullscreen]);

  const reduced = state.reducedMotion;
  const active = chapters[state.chapterIndex].id;

  return (
    <EngineContext.Provider value={engine}>
      <a className="skip-link" href="#/read">Skip to accessible reading mode</a>
      <div className={`viewer ${idle && state.playing ? 'is-idle' : ''}`} ref={viewerRef}>
        <div className="stage-wrap" ref={wrapRef}>
          <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }} aria-hidden={!state.started} role="img" aria-label={`PathSense Home cinematic presentation, chapter ${state.chapterIndex + 1} of 7: ${chapters[state.chapterIndex].title}. A full text version is available in reading mode.`}>
            <Chapter1 active={active === 'ch1'} reduced={reduced} />
            <Chapter2 active={active === 'ch2'} reduced={reduced} />
            <Chapter3 active={active === 'ch3'} reduced={reduced} />
            <Chapter4 active={active === 'ch4'} reduced={reduced} />
            <Chapter5 active={active === 'ch5'} reduced={reduced} />
            <Chapter6 active={active === 'ch6'} reduced={reduced} />
            <Chapter7 active={active === 'ch7'} reduced={reduced} />
            <div className="disclosure" aria-hidden="true">{config.disclosure}</div>
            {state.started && <Captions state={state} />}
          </div>
          {!state.started && !RENDER && <StartScreen onStart={(o) => engine.start(o)} />}
          {state.ended && !RENDER && (
            <div className="overlay end-overlay">
              <div className="panel">
                <h1>Thank you.</h1>
                <p className="tag">{config.productName} — {proposalNext}</p>
                <div className="actions">
                  <button className="btn primary" onClick={() => engine.restart()}>Watch again</button>
                  <button className="btn" onClick={() => engine.jumpTo(6)}>Back to the partnership request</button>
                  <a className="btn" href="#/read">Open reading mode</a>
                  <button className="btn" onClick={() => { setSim(true); }}>Try the proposed experience</button>
                </div>
              </div>
            </div>
          )}
          {sim && <Simulation onClose={() => setSim(false)} />}
          {toast && <div className="toast" role="status">{toast}</div>}
        </div>
        {!RENDER && <Controls state={state} onFullscreen={toggleFullscreen} onSim={() => { setSim(true); engine.pause(); }} />}
      </div>
    </EngineContext.Provider>
  );
}

const proposalNext = 'Partner with us to validate the first real-world prototype.';
export const timeLabel = fmt;
