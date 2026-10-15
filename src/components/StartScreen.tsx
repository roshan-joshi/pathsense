import { useState } from 'react';
import { config } from '../content/config';

export function StartScreen({ onStart }: { onStart: (o: { narration: boolean; captions: boolean }) => void }) {
  const [narration, setNarration] = useState(true);
  const [captions, setCaptions] = useState(true);
  return (
    <div className="overlay" role="dialog" aria-labelledby="start-title" aria-describedby="start-desc">
      <div className="panel">
        <p className="kicker" style={{ marginTop: 0 }}>A five-minute proposal for people who are blind or have low vision</p>
        <h1 id="start-title">Path<b>Sense</b> Home</h1>
        <p className="tag" id="start-desc">Independence, one meaningful task at a time. A cinematic story in seven chapters, about five minutes long, with narration and captions.</p>
        <div className="options">
          <label><input type="checkbox" checked={narration} onChange={(e) => setNarration(e.target.checked)} /> Narration (synthesised voice)</label>
          <label><input type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} /> Captions</label>
        </div>
        <div className="actions">
          <button className="btn primary" autoFocus onClick={() => onStart({ narration, captions })}>▶ Play the story</button>
          <a className="btn" href="#/read">Accessible reading mode</a>
        </div>
        <div className="modes">
          <button onClick={() => onStart({ narration, captions })}><strong>Cinematic auto-play</strong><span>Plays all seven chapters end to end. Space pauses, 1–7 jump, F fullscreen.</span></button>
          <button onClick={() => onStart({ narration: false, captions })}><strong>Silent story</strong><span>Everything essential is on screen. No audio.</span></button>
          <a href="#/read"><strong>Reading mode</strong><span>Structured text, transcript and visual descriptions.</span></a>
        </div>
        <p className="fine">{config.disclosure}</p>
      </div>
    </div>
  );
}
