import { useScene } from '../app/useScene';
import { Headline, Img, Kicker, Logo, StateChip, Veil } from '../components/ui';
import { proposal } from '../content/proposal';
import { config } from '../content/config';
import { drawPrep, type Fx } from '../timeline/fx';
import type gsap from 'gsap';
import { asset } from '../lib/asset';

/* Chapter 7 — One home. Many futures. (50s) */
function build({ root, q, tl, fx }: { root: HTMLElement; q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  drawPrep(root.querySelectorAll('.links path'));
  tl.set(q('.outcome, .home, .head, .ask, .asks div, .final, .kicker-top'), { autoAlpha: 0 });
  fx.lightIn(tl, q('.veil'), 0, 1.6);
  fx.push(tl, q('.protagonist'), 0, { from: 1.0, to: 1.06, d: 9 });
  fx.reveal(tl, q('.outcome'), 1.2, { y: 24, d: 1.0 });
  // Expand to many homes
  tl.to(q('.protagonist'), { autoAlpha: 0, scale: 0.9, duration: 1.4, ease: 'power2.inOut' }, 8.6);
  fx.hide(tl, q('.outcome'), 8.6, { d: 0.8 });
  tl.fromTo(q('.homes-bg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, 8.6);
  tl.fromTo(q('.home.centre'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'back.out(1.6)' }, 9.4);
  const homes = ['.h1', '.h2', '.h3', '.h4'];
  homes.forEach((h, i) => {
    fx.draw(tl, q(`.links .p${i + 1}`), 10.6 + i * 1.6, 1.0);
    tl.fromTo(q(`.home${h}`), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, 11.2 + i * 1.6);
  });
  fx.reveal(tl, q('.head'), 17.6, { y: 20, d: 1.0 });
  // Partnership ask
  tl.to(q('.homes, .head'), { autoAlpha: 0, duration: 1.0 }, 22.0);
  tl.to(q('.homes-bg'), { autoAlpha: 0.5, duration: 1.0 }, 22.0);
  fx.reveal(tl, q('.ask'), 22.6, { y: 24, d: 1.0 });
  fx.reveal(tl, q('.asks div'), 26.0, { y: 20, d: 0.7, stagger: 2.4 });
  // Final screen
  fx.hide(tl, q('.ask'), 37.4, { d: 1.0 });
  tl.to(q('.homes-bg'), { autoAlpha: 0.2, duration: 1.2 }, 37.4);
  fx.reveal(tl, q('.final'), 38.2, { y: 0, d: 1.2 });
  fx.reveal(tl, q('.final .headline'), 42.0, { y: 14, d: 1.0 });
  fx.reveal(tl, q('.final .next, .final .contact'), 45.0, { y: 10, d: 1.0, stagger: 0.6 });
  tl.to({}, { duration: 0.01 }, 50);
}

export function Chapter7({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch7', build, reduced);
  const c = config.contact;
  const contactLines = [c.name, c.email, c.phone, c.website].filter(Boolean);
  return (
    <div ref={ref} className={`scene ch7 ${active ? 'is-active' : ''}`}>
      <Img name="bg-kitchen-soft" className="cover" style={{ filter: 'brightness(0.3)' }} />
      <Img name="bg-homes-soft" className="cover homes-bg" style={{ filter: 'brightness(0.45)', opacity: 0 }} />
      <Img name="ch3-complete-cup" className="protagonist" />
      <div className="vignette" />
      <div className="abs outcome">
        <Kicker>Conceptual outcome · not a trial result</Kicker>
        <Headline size="lg">The coffee found. The cup filled. <em>The morning started on his own terms.</em></Headline>
        <div style={{ marginTop: 22 }}><StateChip state="verified">Coffee found · confirmed by him</StateChip></div>
      </div>

      <div className="homes" aria-hidden="true">
        <svg className="links" viewBox="0 0 1920 1080">
          <path className="p1" d="M960 520 C 800 420, 620 400, 470 420" />
          <path className="p2" d="M960 520 C 1120 400, 1300 380, 1450 400" />
          <path className="p3" d="M960 520 C 800 640, 620 700, 470 720" />
          <path className="p4" d="M960 520 C 1120 640, 1300 700, 1450 720" />
        </svg>
        <div className="home centre"><img src={asset('images/ch7-house.jpg')} alt="" /><div className="lbl">One real home · one real task</div></div>
        <div className="home h1" style={{ left: 170, top: 330 }}><img src={asset('images/ch7-person-a.jpg')} alt="" /><div className="lbl">Identifying ingredients</div></div>
        <div className="home h2" style={{ left: 1450, top: 310 }}><img src={asset('images/ch7-person-b.jpg')} alt="" /><div className="lbl">Household routines, hands free</div></div>
        <div className="home h3" style={{ left: 170, top: 630 }}><img src={asset('images/ch7-person-c.jpg')} alt="" /><div className="lbl">Reading documents and labels</div></div>
        <div className="home h4" style={{ left: 1450, top: 630 }}><img src={asset('images/ch7-person-d.jpg')} alt="" /><div className="lbl">Finding belongings · own pace, own words</div></div>
      </div>
      <div className="abs head"><Headline size="xl">Start with one real problem.<br /><em>Build a platform that can support many.</em></Headline></div>

      <div className="abs ask">
        <Kicker>Our invitation</Kicker>
        <Headline size="xl" style={{ marginTop: 14 }}>We invite your organisation to help us <em>co-design, evaluate and responsibly develop</em> PathSense.</Headline>
        <div className="asks">
          {proposal.partnership.asks.map((a, i) => <div key={a}><b>{['Co-design', 'Expertise', 'Testing', 'Funding'][i]}</b>{a}</div>)}
        </div>
      </div>

      <div className="abs final">
        <div>
          <Logo />
          <Headline size="lg">Independence, <em>one meaningful task at a time.</em></Headline>
          <p className="next">{proposal.partnership.nextStep}</p>
          <p className="contact">{contactLines.length ? contactLines.map((l) => <span key={l}>{l}<br /></span>) : 'Contact details: configure in src/content/config.ts'}</p>
        </div>
      </div>
      <Veil />
    </div>
  );
}
