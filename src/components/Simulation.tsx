import { useEffect, useRef, useState } from 'react';
import { PROCESS_STEPS } from '../content/story';
import { config } from '../content/config';
import { ProcessStrip, StateChip } from './ui';

/**
 * Optional interactive product moment: a clearly labelled simulated PathSense interaction.
 * No AI, no camera: a scripted walk-through that lets the presenter show the intended loop.
 */
const STEPS = [
  { title: 'Goal', body: '“PathSense, help me find the coffee.”', chip: ['neutral', 'Goal understood: find coffee'] as const, action: 'Open the camera' },
  { title: 'Camera', body: 'Point the phone at the pantry. The view is analysed on the phone.', chip: ['active', 'Camera: pantry · analysing'] as const, action: 'Look for a match' },
  { title: 'Candidate', body: 'A possible coffee container is outlined. The AI does not pretend to be certain.', chip: ['uncertain', 'Possible coffee container · uncertain'] as const, action: 'Describe its position' },
  { title: 'Assist', body: '“I can see what looks like a coffee container on the middle shelf, toward the right. Can you check it?”', chip: ['uncertain', 'Waiting for the person to check'] as const, action: 'I have checked it' },
  { title: 'Verify', body: 'The person checks the jar by hand (label, shape, weight, smell) and confirms or rejects.', chip: ['neutral', 'Confirm: is this the coffee?'] as const, action: 'Yes — that is the coffee' },
  { title: 'Outcome', body: 'Coffee found. Confirmed by user. Optionally remember “coffee · pantry, middle shelf” for next time, if the person chooses.', chip: ['verified', 'Coffee found · confirmed by user'] as const, action: 'Start again' },
];

export function Simulation({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const [remember, setRemember] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  const s = STEPS[i];
  const next = () => setI((v) => (v + 1) % STEPS.length);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="sim-title" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <div className="panel sim">
        <p className="kicker" style={{ marginTop: 0 }}>{config.simulationLabel}</p>
        <h1 id="sim-title" style={{ fontSize: 40 }}>Try the proposed experience</h1>
        <p className="tag">A scripted simulation of the Stage 1 mobile flow. There is no live AI or camera behind this screen.</p>
        <div className="sim-grid">
          <div className="sim-phone" aria-hidden="true">
            <div className="sim-screen">
              <div className="sim-goal">Goal <b>Find coffee</b></div>
              <div className={`sim-cam step-${i}`}>
                <img src="images/pantry-feed.jpg" alt="" />
                {i >= 2 && <div className={`sim-cand ${i === 5 ? 'ok' : ''}`} />}
                {i === 1 && <div className="sim-scan" />}
              </div>
              <div className="sim-strip"><ProcessStrip steps={PROCESS_STEPS.map((p, k) => (k <= i ? '● ' : '○ ') + p)} /></div>
            </div>
          </div>
          <div className="sim-side">
            <p className="kicker">Step {i + 1} of {STEPS.length} · {s.title}</p>
            <p className="sim-body">{s.body}</p>
            <StateChip state={s.chip[0]}>{s.chip[1]}</StateChip>
            {i === 5 && <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember this location (user-controlled, deletable)</label>}
            <div className="actions" style={{ marginTop: 22 }}>
              <button ref={first} className="btn primary" onClick={next}>{s.action}</button>
              {i === 4 && <button className="btn" onClick={() => setI(1)}>No — look again</button>}
              <button className="btn" onClick={onClose}>Close and return to the story</button>
            </div>
            <p className="fine">The person verifies every result. Uncertain observations are labelled as uncertain. Hot water, gas and appliances remain the person’s own steps.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
