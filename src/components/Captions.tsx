import { useEffect, useRef, useState } from 'react';
import { chapters } from '../content/story';
import type { EngineState } from '../timeline/engine';

/** Narration subtitles, timed from narration-timing.json. Also announced politely to screen readers. */
export function Captions({ state }: { state: EngineState }) {
  const ch = chapters[state.chapterIndex];
  const line = ch.subtitles.find((l) => state.local >= l.start - 0.15 && state.local < l.end + 0.6);
  const [live, setLive] = useState('');
  const lastRef = useRef('');
  useEffect(() => {
    const text = line?.text ?? '';
    if (text && text !== lastRef.current) { lastRef.current = text; setLive(text); }
  }, [line]);
  return (
    <>
      <div className={`captions ${state.captions && line ? '' : 'is-hidden'}`} aria-hidden="true">
        {line && <p>{line.text}</p>}
      </div>
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">{state.captions ? live : ''}</div>
    </>
  );
}
