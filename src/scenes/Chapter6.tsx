import { useScene } from '../app/useScene';
import { Headline, Img, Kicker, Ribbon, StateChip, Veil } from '../components/ui';
import { proposal } from '../content/proposal';
import type { Fx } from '../timeline/fx';
import type gsap from 'gsap';

/* Chapter 6 — Does it truly work? (42s) */
function build({ q, tl, fx }: { q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  tl.set(q('.label, .step, .line, .measure, .core, .ribbon'), { autoAlpha: 0 });
  fx.lightIn(tl, q('.veil'), 0, 1.4);
  fx.push(tl, q('.group'), 0, { from: 1.0, to: 1.08, d: 18, y: -20 });
  fx.reveal(tl, q('.ribbon'), 0.4, { y: -8 });
  fx.reveal(tl, q('.label'), 0.8, { y: 20 });
  // research path
  tl.fromTo(q('.line'), { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: fx.reduced ? 0.3 : 11, ease: 'none' }, 5.2);
  fx.reveal(tl, q('.step'), 5.2, { y: 24, d: 0.7, stagger: 1.9 });
  // measures replace the path
  tl.to(q('.group'), { autoAlpha: 0.25, filter: 'blur(5px)', duration: 1.2 }, 17.4);
  fx.hide(tl, q('.label, .step, .line'), 17.4, { d: 0.6, stagger: 0.03 });
  fx.reveal(tl, q('.measure'), 18.2, { y: 20, d: 0.6, stagger: 1.75 });
  fx.reveal(tl, q('.core'), 30.0, { y: 20, d: 1.0 });
  tl.to({}, { duration: 0.01 }, 42);
}

export function Chapter6({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch6', build, reduced);
  const steps = [['Understand', 'current task methods'], ['Select', 'a real-world problem'], ['Build', 'a limited prototype'], ['Test', 'with willing participants'], ['Measure', 'outcomes'], ['Improve', 'based on evidence']];
  return (
    <div ref={ref} className={`scene ch6 ${active ? 'is-active' : ''}`}>
      <Img name="ch6-codesign" className="group" />
      <div className="grad-left" /><div className="grad-bottom" /><div className="vignette" />
      <Ribbon>Conceptual co-design session · illustrative · no sessions have taken place yet</Ribbon>
      <div className="abs label">
        <Kicker>Does it truly work?</Kicker>
        <Headline size="xl">Built <em>with</em> people who are blind or have low vision — not just for them.</Headline>
      </div>
      <div className="path">
        <div className="line" />
        <div className="steps">{steps.map(([b, t]) => <div key={b} className="step"><b>{b}</b>{t}</div>)}</div>
      </div>
      <div className="measures">
        {proposal.evaluation.measures.map((m) => <div key={m} className="measure"><span>{m}</span><StateChip state="neutral">To be measured</StateChip></div>)}
      </div>
      <div className="abs core"><Headline size="lg">We don’t measure success by how impressive the AI looks. <em>We measure whether everyday independence improves.</em></Headline></div>
      <Veil />
    </div>
  );
}
