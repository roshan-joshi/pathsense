import { chapters, chapterStart } from '../content/story';
import type { EngineState } from '../timeline/engine';
import { useEngine } from '../app/EngineContext';
import { fmt } from '../timeline/fx';

export function Controls({ state, onFullscreen, onSim }: { state: EngineState; onFullscreen: () => void; onSim: () => void }) {
  const engine = useEngine();
  const pct = (state.time / engine.total) * 100;
  const ch = chapters[state.chapterIndex];
  return (
    <div className={`controls ${state.started ? '' : 'is-hidden'}`} role="region" aria-label="Playback controls">
      <button className="btn primary" onClick={() => engine.toggle()} aria-label={state.playing ? 'Pause' : 'Play'} aria-keyshortcuts="Space">
        {state.playing ? '❚❚ Pause' : state.ended ? '↻ Replay' : '▶ Play'}
      </button>
      <button className="btn icon" onClick={() => engine.restart()} aria-label="Restart from the beginning" title="Restart (R)">↺</button>
      <button className="btn icon" onClick={() => engine.prev()} aria-label="Previous chapter" title="Previous chapter (←)">‹</button>
      <button className="btn icon" onClick={() => engine.next()} aria-label="Next chapter" title="Next chapter (→)">›</button>
      <div className="chapter-nav" role="group" aria-label="Jump to chapter">
        {chapters.map((c) => (
          <button key={c.id} onClick={() => engine.jumpTo(c.index)} aria-current={c.index === state.chapterIndex} aria-label={`Chapter ${c.index + 1}: ${c.title}`} title={c.title}>{c.index + 1}</button>
        ))}
      </div>
      <div className="progress" aria-hidden="true">
        <div className="track" onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); engine.seek(((e.clientX - r.left) / r.width) * engine.total); }}>
          <div className="fill" style={{ width: `${pct}%` }} />
          <div className="ticks">{chapters.slice(1).map((c) => <span key={c.id} className="tick" style={{ left: `${(chapterStart(c.index) / engine.total) * 100}%` }} />)}</div>
        </div>
        <div className="meta"><span>{ch.number} · {ch.title}</span><span>{fmt(state.time)} / {fmt(engine.total)}</span></div>
      </div>
      <input className="visually-hidden" type="range" min={0} max={Math.round(engine.total)} value={Math.round(state.time)} aria-label="Presentation position in seconds" onChange={(e) => engine.seek(Number(e.target.value))} />
      <button className="btn" onClick={() => engine.setNarration(!state.narration)} aria-pressed={state.narration} title="Narration (M)">{state.narration ? '🔊 Narration' : '🔇 Narration'}</button>
      <button className="btn" onClick={() => engine.setCaptions(!state.captions)} aria-pressed={state.captions} title="Captions (C)">CC</button>
      <button className="btn" onClick={onSim} title="Try the proposed experience (T)">Try it</button>
      <a className="btn" href="#/read" title="Accessible reading mode">Read</a>
      <button className="btn icon" onClick={onFullscreen} aria-label="Toggle fullscreen" title="Fullscreen (F)">⛶</button>
    </div>
  );
}
