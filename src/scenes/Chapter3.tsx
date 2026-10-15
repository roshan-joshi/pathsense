import { useScene } from '../app/useScene';
import { CommandBubble, Headline, Img, Kicker, Phone, ProcessStrip, Ribbon, StateChip, Veil } from '../components/ui';
import { PROCESS_STEPS } from '../content/story';
import { config } from '../content/config';
import type { Fx } from '../timeline/fx';
import type gsap from 'gsap';

/* Chapter 3 — The first solution: find the coffee (60s). Simulated. */
function build({ q, tl, fx }: { q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  tl.set(q('.cmd, .phone, .ai, .say, .hand, .verified, .core, .future .pill, .future .arrow, .future-note, .loop, .kicker-top, .cam, .cand, .cand-lbl, .scan, .goal-chip, .analysing, .found'), { autoAlpha: 0 });
  tl.set(q('.process-dot'), { borderColor: '#4a4238', backgroundColor: 'transparent' });
  tl.set(q('.process-step span:last-child'), { color: '#a99e8d' });
  const light = (i: number, at: number) => {
    tl.to(q(`.process-step[data-step="${i}"] .process-dot`), { borderColor: '#e2bb6a', backgroundColor: '#e2bb6a', duration: 0.4 }, at);
    tl.to(q(`.process-step[data-step="${i}"] span:last-child`), { color: '#f4ece0', duration: 0.4 }, at);
  };

  fx.lightIn(tl, q('.veil'), 0, 1.2);
  fx.push(tl, q('.portrait'), 0, { from: 1.08, to: 1.0, d: 12 });
  fx.reveal(tl, q('.ribbon'), 0.3, { y: -8 });
  fx.reveal(tl, q('.kicker-top'), 0.6, { y: 10 });
  // Scene 1 — voice request
  fx.reveal(tl, q('.cmd'), 3.4, { y: 16, scale: 0.96, d: 0.7 });
  // Scene 2 — phone + goal recognised
  fx.reveal(tl, q('.phone'), 5.2, { y: 40, d: 1.0 });
  fx.reveal(tl, q('.goal-chip'), 7.4, { y: 8, d: 0.6 });
  light(0, 7.6);
  // Scene 3 — camera view of pantry
  fx.reveal(tl, q('.cam'), 11.3, { y: 0, d: 0.6 });
  light(1, 11.5);
  tl.fromTo(q('.cam img'), { scale: 1.12, x: 10, y: 6 }, { scale: 1.0, x: 0, y: 0, duration: 7, ease: 'sine.inOut' }, 11.3);
  if (!fx.reduced) tl.to(q('.cam img'), { x: '+=6', y: '-=4', duration: 1.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 11.3);
  fx.reveal(tl, q('.analysing'), 12.0, { y: 6, d: 0.5 });
  tl.fromTo(q('.scan'), { autoAlpha: 0, top: '-14%' }, { autoAlpha: 1, top: '100%', duration: 2.2, ease: 'sine.inOut', repeat: 1 }, 12.4);
  tl.to(q('.scan'), { autoAlpha: 0, duration: 0.3 }, 16.8);
  // Scene 4 — candidate (uncertain)
  tl.fromTo(q('.cand'), { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, 15.6);
  fx.reveal(tl, q('.cand-lbl'), 16.2, { y: 6, d: 0.5 });
  fx.hide(tl, q('.analysing'), 16.0);
  light(2, 16.4);
  // Scene 5 — spoken assistance
  fx.reveal(tl, q('.ai'), 18.6, { y: 14, scale: 0.97, d: 0.8 });
  fx.hide(tl, q('.cmd'), 18.6);
  // Scene 6 — verification: hand reaches for the jar
  tl.fromTo(q('.hand'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1.0, duration: 1.4, ease: 'power2.out' }, 23.8);
  light(3, 24.2);
  fx.reveal(tl, q('.say'), 25.4, { y: 14, scale: 0.96, d: 0.7 });
  fx.hide(tl, q('.ai'), 25.4);
  // Scene 7 — completion
  fx.reveal(tl, q('.found'), 27.9, { y: 10, d: 0.6 });
  tl.to(q('.cand'), { borderColor: '#8fc29a', borderStyle: 'solid', duration: 0.5 }, 27.9);
  tl.to(q('.cand-lbl'), { autoAlpha: 0, duration: 0.3 }, 27.9);
  light(4, 28.2); light(5, 28.6);
  fx.reveal(tl, q('.verified'), 28.4, { y: 20, d: 0.9 });
  fx.hide(tl, q('.say'), 28.2);
  // Simulation note (narration 30.5-36.4) stays visible as ribbon; then core message
  fx.hide(tl, q('.hand, .verified, .phone'), 36.4, { d: 0.9 });
  tl.to(q('.portrait'), { autoAlpha: 0, duration: 0.9 }, 36.4);
  fx.hide(tl, q('.kicker-top'), 36.4);
  fx.reveal(tl, q('.core'), 37.2, { y: 30, d: 1.2 });
  fx.reveal(tl, q('.loop'), 39.4, { y: 16, d: 0.9 });
  [0, 1, 2, 3, 4, 5].forEach((i) => light(i, 39.8 + i * 0.35));
  // Future continuation
  fx.reveal(tl, q('.future .pill, .future .arrow'), 44.6, { y: 14, d: 0.6, stagger: 0.45 });
  fx.reveal(tl, q('.future-note'), 48.6, { y: 10, d: 0.8 });
  tl.to({}, { duration: 0.01 }, 60);
}

export function Chapter3({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch3', build, reduced);
  return (
    <div ref={ref} className={`scene ch3 ${active ? 'is-active' : ''}`}>
      <Img name="bg-kitchen-soft" className="cover" style={{ filter: 'brightness(0.3)' }} />
      <Img name="ch3-voice-request" className="portrait" />
      <Img name="ch1-hand-jar" className="hand" />
      <div className="vignette" />
      <Ribbon>{config.simulationLabel}</Ribbon>
      <Kicker className="abs kicker-top" style={{ left: 120, top: 80 }}>Stage 1 · The first prototype · Mobile camera</Kicker>
      <CommandBubble className="cmd" speaker="user">“PathSense, help me find the coffee.”</CommandBubble>

      <Phone className="phone">
        <div className="screen-top">
          <div className="goal"><span>Goal</span><b className="goal-chip">Find coffee</b></div>
        </div>
        <div className="cam">
          <img src="images/pantry-feed.jpg" alt="" />
          <div className="frame" />
          <div className="status">Camera · pantry</div>
          <div className="scan" />
          <div className="cand" />
          <div className="cand-lbl">Possible coffee container · uncertain</div>
          <div className="analysing abs" style={{ left: 14, bottom: 14, fontSize: 15, color: 'var(--amber-2)' }}>Analysing the view…</div>
        </div>
        <div className="screen-bottom">
          <ProcessStrip steps={PROCESS_STEPS} />
          <div className="found" style={{ marginTop: 14 }}><StateChip state="verified">Coffee found · confirmed by him</StateChip></div>
        </div>
      </Phone>

      <CommandBubble className="ai" speaker="ai">“I can see what looks like a coffee container on the middle shelf, toward the right. Can you check it?”</CommandBubble>
      <CommandBubble className="say" speaker="user">“Yes — that’s the coffee.”</CommandBubble>

      <div className="abs verified">
        <StateChip state="verified">Verified by the person</StateChip>
        <Headline size="xl">Coffee found.<br />Confirmed by him.</Headline>
      </div>

      <div className="abs core">
        <Headline size="xl">One spoken goal. Relevant assistance.<br /><em>A verified result.</em></Headline>
      </div>
      <div className="loop"><ProcessStrip steps={PROCESS_STEPS} /></div>
      <div className="future">
        <span className="pill">Find the cup</span><span className="arrow">→</span>
        <span className="pill">Find the milk</span><span className="arrow">→</span>
        <span className="pill" style={{ borderStyle: 'dashed' }}>An approved routine (future)</span>
      </div>
      <p className="abs future-note">Hot water, gas and appliances remain the person’s own steps. The prototype does not claim to supervise them.</p>
      <Veil />
    </div>
  );
}
