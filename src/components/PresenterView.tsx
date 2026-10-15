import { useEffect, useState } from 'react';
import { chapters } from '../content/story';
import type { EngineState } from '../timeline/engine';
import { fmt } from '../timeline/fx';

/** Second-screen presenter view. Open in another window; it mirrors state and can control the main window. */
export function PresenterView() {
  const [state, setState] = useState<EngineState | null>(null);
  const [ch, setCh] = useState<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const c = new BroadcastChannel('pathsense-presenter');
    c.onmessage = (e) => { if (e.data?.type === 'state') setState(e.data.state); };
    c.postMessage({ cmd: 'hello' });
    setCh(c);
    return () => c.close();
  }, []);
  const send = (cmd: string, value?: number) => ch?.postMessage({ cmd, value });
  if (!state) return <main className="reading"><h1>Presenter view</h1><p>Waiting for the main presentation window. Start the story there, then this view updates automatically.</p></main>;
  const c = chapters[state.chapterIndex];
  const next = chapters[state.chapterIndex + 1];
  return (
    <main className="reading presenter-view">
      <header>
        <p className="kicker">Presenter view · {state.playing ? 'Playing' : 'Paused'}</p>
        <h1>{c.number} · {c.title}</h1>
        <p className="timer">{fmt(state.local)} / {fmt(c.duration)} · total {fmt(state.time)}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => send('toggle')}>{state.playing ? 'Pause' : 'Play'}</button>
          <button className="btn" onClick={() => send('prev')}>‹ Prev</button>
          <button className="btn" onClick={() => send('next')}>Next ›</button>
          <button className="btn" onClick={() => send('restart')}>Restart</button>
          {chapters.map((x) => <button key={x.id} className="btn" aria-current={x.index === state.chapterIndex} onClick={() => send('jump', x.index)}>{x.index + 1}</button>)}
        </div>
      </header>
      <section><h2>Notes</h2>{c.notes.map((n, i) => <p key={i} style={{ fontSize: 22 }}>{n}</p>)}</section>
      <section><h2>On screen</h2><ul>{c.keyMessages.map((m, i) => <li key={i}>{m}</li>)}</ul></section>
      {next && <section><h2>Next</h2><p>{next.number} · {next.title}</p></section>}
    </main>
  );
}
