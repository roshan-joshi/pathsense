import { useScene } from '../app/useScene';
import { Caption, Headline, Img, Kicker, Logo, Veil } from '../components/ui';
import type { Fx } from '../timeline/fx';
import type gsap from 'gsap';

/* Chapter 1 — A life built around familiarity (46s)
   Opens from black: sound first, then blurred light and the outlines of a home emerge and sharpen.
   This is an emergence from the absence of *information*, not a claim about what blind people see. */
function build({ q, tl, fx }: { q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  const R = fx.reduced;
  tl.set(q('.k, .q, .logo-block, .tagline, .kicker, .marker, .callout, .cue, .horizon'), { autoAlpha: 0 });
  tl.set(q('.hero'), { autoAlpha: 0, filter: 'blur(28px) brightness(0.35)', scale: 1.1 });
  tl.set(q('.ambient'), { autoAlpha: 0, scale: 1.12 });
  tl.set(q('.light-rays'), { autoAlpha: 0 });
  tl.set(q('.bloom'), { autoAlpha: 0, scale: 0.6 });

  // 0–9 s: blackout with room tone only → soft ochre bloom → blurred forms → a horizon line
  tl.to(q('.veil'), { autoAlpha: 0.92, duration: 0.01 }, 0);
  tl.to(q('.bloom'), { autoAlpha: 0.9, scale: 1.0, duration: R ? 0.6 : 6.0, ease: 'sine.out' }, 2.5);
  tl.to(q('.ambient'), { autoAlpha: 1, scale: 1.02, duration: R ? 0.6 : 7.0, ease: 'sine.out' }, 4.0);
  tl.fromTo(q('.horizon'), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: R ? 0.4 : 2.6, ease: 'power2.out' }, 6.0);
  tl.to(q('.veil'), { autoAlpha: 0, duration: R ? 0.6 : 5.0, ease: 'sine.inOut' }, 6.0);
  // 9–14 s: narration names the sounds; the cues appear with the words
  [['.cue1', 10.7], ['.cue2', 11.9], ['.cue3', 13.0]].forEach(([c, at]) => { fx.reveal(tl, q(c as string), at as number, { y: 8, d: 0.8 }); fx.hide(tl, q(c as string), (at as number) + 1.6, { d: 0.6 }); });
  // 13–17 s: the kitchen sharpens into morning light; the person appears as his story begins
  tl.to(q('.hero'), { autoAlpha: 1, filter: 'blur(0px) brightness(1)', scale: 1.0, duration: R ? 0.8 : 4.0, ease: 'power2.inOut' }, 13.2);
  tl.to(q('.horizon'), { autoAlpha: 0, duration: 1.4 }, 13.6);
  tl.to(q('.bloom'), { autoAlpha: 0.3, duration: 3 }, 14.0);
  tl.fromTo(q('.light-rays'), { autoAlpha: 0, xPercent: -6 }, { autoAlpha: 1, xPercent: 4, duration: 12, ease: 'sine.inOut' }, 14.0);
  tl.to(q('.light-rays'), { autoAlpha: 0.45, duration: 10, ease: 'sine.inOut' }, 27);
  fx.push(tl, q('.hero'), 17.2, { from: 1.0, to: 1.07, d: 29, x: -14 });

  // Story lines, timed to narration
  fx.reveal(tl, q('.kicker'), 14.6, { y: 10 });
  fx.reveal(tl, q('.k1'), 15.2, { y: 30 });
  fx.hide(tl, q('.k1'), 18.9);
  fx.reveal(tl, q('.k2'), 19.3, { y: 30 });
  fx.hide(tl, q('.k2'), 21.3);
  fx.reveal(tl, q('.k3'), 21.6, { y: 30 });
  fx.hide(tl, q('.k3'), 24.4);
  fx.hide(tl, q('.kicker'), 24.4);
  ['.q1', '.q2', '.q3'].forEach((sel, i) => fx.reveal(tl, q(sel), 24.8 + i * 1.3, { y: 18, d: 0.8 }));
  fx.hide(tl, q('.q1, .q2, .q3'), 29.2, { stagger: 0.06 });
  const items: [string, number][] = [['.m-cane', 29.8], ['.m-phone', 31.9], ['.m-hands', 33.8]];
  items.forEach(([sel, at]) => {
    tl.fromTo(q(sel + ' .marker'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, at);
    fx.reveal(tl, q(sel + ' .callout'), at + 0.25, { y: 12, d: 0.7 });
  });
  fx.hide(tl, q('.m-cane, .m-phone, .m-hands'), 36.4, { stagger: 0.08 });
  tl.to(q('.dim'), { backgroundColor: 'rgba(14,9,7,0.64)', duration: 1.6, ease: 'power2.inOut' }, 36.7);
  fx.reveal(tl, q('.logo-block'), 37.3, { y: 26, d: 1.2 });
  fx.reveal(tl, q('.tagline'), 38.8, { y: 16, d: 1.0 });
  tl.to({}, { duration: 0.01 }, 46);
}

export function Chapter1({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch1', build, reduced);
  return (
    <div ref={ref} className={`scene ch1 ${active ? 'is-active' : ''}`}>
      <Img name="ch1-kitchen-ambient" className="ambient cover" />
      <div className="bloom" aria-hidden="true" />
      <Img name="ch1-kitchen-hero" className="hero" />
      <div className="light-rays" />
      <div className="earth-wash" />
      <div className="grad-left" />
      <div className="vignette" />
      <div className="dim" />
      <div className="horizon" style={{ top: 640 }} />
      <p className="abs cue cue1">a kettle</p>
      <p className="abs cue cue2">a fridge door</p>
      <p className="abs cue cue3">a room known by heart</p>

      <Kicker className="abs kicker">An Australian home · morning · an illustrative story</Kicker>
      <Headline className="abs k k1" size="xxl">Years running a café.<br /><span className="k1b">He knew where everything belonged.</span></Headline>
      <Headline className="abs k k2" size="xxl">Then his vision <em>changed.</em></Headline>
      <Headline className="abs k k3" size="xl" style={{ width: 900 }}>The knowledge stayed.<br /><em>The information moved out of reach.</em></Headline>

      <Caption className="abs q q1" style={{ top: 380, fontSize: 40, color: 'var(--ink)' }}>What is on the shelf?</Caption>
      <Caption className="abs q q2" style={{ top: 450, fontSize: 40, color: 'var(--ink)' }}>Which carton is which?</Caption>
      <Caption className="abs q q3" style={{ top: 520, fontSize: 40, color: 'var(--ink)' }}>Where were the keys left?</Caption>

      <div className="m-cane">
        <span className="marker" style={{ left: 748, top: 690 }} />
        <div className="callout" style={{ left: 330, top: 640 }}><span className="callout-label">A cane, and training</span><span className="callout-sub">His own way of moving through the house</span></div>
      </div>
      <div className="m-phone">
        <span className="marker" style={{ left: 1482, top: 950 }} />
        <div className="callout" style={{ left: 1130, top: 905, transform: 'translateY(-100%)' }}><span className="callout-label">A voice assistant</span><span className="callout-sub">Calls and messages, hands free</span></div>
      </div>
      <div className="m-hands">
        <span className="marker" style={{ left: 1790, top: 210 }} />
        <div className="callout" style={{ left: 1330, top: 100 }}><span className="callout-label">Hands, memory and years of kitchen knowledge</span><span className="callout-sub">He locates and identifies things by touch and knows his home well</span></div>
      </div>

      <div className="abs logo-block"><Logo /></div>
      <Caption className="abs tagline">From understanding surroundings to completing everyday tasks.</Caption>
      <Veil />
    </div>
  );
}
