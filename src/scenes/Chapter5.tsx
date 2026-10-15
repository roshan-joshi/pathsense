import { useScene } from '../app/useScene';
import { Headline, Img, Kicker, StateChip, Veil } from '../components/ui';
import type { Fx } from '../timeline/fx';
import type gsap from 'gsap';

/* Chapter 5 — Personal to every individual (35s) */
function build({ q, tl, fx }: { q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  tl.set(q('.headline-block, .profile, .pref, .shared .chip, .core, .note'), { autoAlpha: 0 });
  fx.lightIn(tl, q('.veil'), 0, 1.0);
  fx.reveal(tl, q('.headline-block'), 0.5, { y: 20 });
  fx.reveal(tl, q('.profile.a'), 3.0, { y: 30, d: 0.9 });
  fx.reveal(tl, q('.profile.b'), 6.4, { y: 30, d: 0.9 });
  // preferences animate in, sliders move to each person's setting
  fx.reveal(tl, q('.profile.a .pref'), 10.6, { y: 8, d: 0.5, stagger: 0.9 });
  fx.reveal(tl, q('.profile.b .pref'), 10.9, { y: 8, d: 0.5, stagger: 0.9 });
  tl.fromTo(q('.profile.a .k-detail'), { left: '50%' }, { left: '18%', duration: 1.2, ease: 'power2.inOut' }, 11.2);
  tl.fromTo(q('.profile.b .k-detail'), { left: '50%' }, { left: '86%', duration: 1.2, ease: 'power2.inOut' }, 11.5);
  tl.fromTo(q('.profile.a .k-speed'), { left: '50%' }, { left: '72%', duration: 1.2, ease: 'power2.inOut' }, 12.1);
  tl.fromTo(q('.profile.b .k-speed'), { left: '50%' }, { left: '34%', duration: 1.2, ease: 'power2.inOut' }, 12.4);
  fx.reveal(tl, q('.shared .chip'), 16.4, { y: 8, d: 0.5, stagger: 0.7 });
  fx.reveal(tl, q('.note'), 22.4, { y: 8, d: 0.8 });
  fx.reveal(tl, q('.core'), 27.0, { y: 20, d: 1.0 });
  tl.to({}, { duration: 0.01 }, 35);
}

const Slider = ({ cls, lo, hi }: { cls: string; lo: string; hi: string }) => (
  <div className="slider"><span className={`knob ${cls}`} /><span className="lo">{lo}</span><span className="hi">{hi}</span></div>
);

export function Chapter5({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch5', build, reduced);
  return (
    <div ref={ref} className={`scene ch5 ${active ? 'is-active' : ''}`}>
      <Img name="bg-kitchen-soft" className="bg" />
      <div className="abs headline-block">
        <Kicker>Personal to every individual</Kicker>
        <Headline size="lg" style={{ marginTop: 12 }}>No two people want the same help.</Headline>
      </div>
      <div className="profile a">
        <div className="avatar"><img src="images/ch3-complete-cup.jpg" alt="" /></div>
        <h3>The café owner</h3><p className="who">Years of kitchen knowledge · prefers short, direct prompts</p>
        <div className="pref"><span className="lbl">Instruction detail</span><Slider cls="k-detail" lo="Brief" hi="Step by step" /></div>
        <div className="pref"><span className="lbl">Speaking speed</span><Slider cls="k-speed" lo="Slower" hi="Faster" /></div>
        <div className="pref"><span className="lbl">Language</span><span className="val">English (Australia)</span></div>
        <div className="pref"><span className="lbl">Familiar locations</span><span className="val">Coffee · pantry, middle shelf · saved by him</span></div>
      </div>
      <div className="profile b">
        <div className="avatar anon" aria-hidden="true">?</div>
        <h3>Another person</h3><p className="who">Newer to the kitchen · wants every step explained</p>
        <div className="pref"><span className="lbl">Instruction detail</span><Slider cls="k-detail" lo="Brief" hi="Step by step" /></div>
        <div className="pref"><span className="lbl">Speaking speed</span><Slider cls="k-speed" lo="Slower" hi="Faster" /></div>
        <div className="pref"><span className="lbl">Language</span><span className="val">Their choice</span></div>
        <div className="pref"><span className="lbl">Familiar locations</span><span className="val">Added only when they choose to</span></div>
      </div>
      <div className="shared">
        <StateChip state="active">Current goal: chosen by the person</StateChip>
        <StateChip state="neutral">Remembered information: user-controlled, deletable</StateChip>
        <StateChip state="off">Privacy settings: cameras and memory off by default</StateChip>
      </div>
      <div className="abs core"><Headline size="lg">PathSense should adapt to the person — <em>not the other way around.</em></Headline></div>
      <p className="abs note">Based on explicit preferences and user-controlled information. Nothing about mood, ability or health is inferred from camera imagery.</p>
      <Veil />
    </div>
  );
}
