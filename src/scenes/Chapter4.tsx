import { useScene } from '../app/useScene';
import { Headline, Img, Kicker, RoadmapPanel, StateChip, Veil } from '../components/ui';
import { drawPrep, type Fx } from '../timeline/fx';
import type gsap from 'gsap';
import { asset } from '../lib/asset';

/* Chapter 4 — A home that can provide useful information (44s). Three stages, one system. */
function build({ root, q, tl, fx }: { root: HTMLElement; q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  drawPrep(root.querySelectorAll('.plan .link'));
  tl.set(q('.kicker, .viewfinder, .roomcam, .plan, .stage-card, .privacy .chip, .core, .cam-icon'), { autoAlpha: 0 });
  tl.set(q('.plan .cam, .plan .hub, .plan text'), { autoAlpha: 0 });
  fx.lightIn(tl, q('.veil'), 0, 1.2);
  fx.push(tl, q('.hand'), 0, { from: 1.06, to: 1.0, d: 10 });
  fx.reveal(tl, q('.kicker'), 0.6, { y: 10 });
  // Phone viewfinder grows out of the hand-held phone
  tl.fromTo(q('.viewfinder'), { autoAlpha: 0, scale: 0.35, x: -260, y: 160 }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: fx.reduced ? 0.5 : 1.6, ease: 'power3.inOut' }, 4.4);
  // ...transforms into a room-camera feed
  tl.to(q('.viewfinder .tag'), { textContent: 'Room camera · kitchen', duration: 0 }, 7.6);
  tl.fromTo(q('.viewfinder .pt'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 7.6);
  if (!fx.reduced) tl.to(q('.viewfinder img'), { xPercent: -8, scale: 1.15, duration: 3.2, ease: 'sine.inOut' }, 7.6);
  tl.to(q('.hand'), { autoAlpha: 0, duration: 1.2 }, 7.8);
  tl.fromTo(q('.roomcam'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1.0, duration: 1.6, ease: 'power2.out' }, 7.8);
  tl.to(q('.viewfinder'), { x: 1060, y: -60, scale: 0.6, duration: fx.reduced ? 0.5 : 1.6, ease: 'power3.inOut' }, 9.2);
  // ...then the home: floor plan + stage cards
  tl.to(q('.roomcam'), { autoAlpha: 0.22, filter: 'blur(6px)', duration: 1.4 }, 10.6);
  tl.to(q('.viewfinder'), { autoAlpha: 0, duration: 0.6 }, 11.0);
  fx.reveal(tl, q('.plan'), 11.2, { y: 0, d: 0.8 });
  fx.reveal(tl, q('.stage-card.s1'), 11.4, { x: 40, y: 0, d: 0.9 });
  tl.to(q('.plan .hub, .plan .t-hub'), { autoAlpha: 1, duration: 0.5 }, 11.8);
  tl.to(q('.plan .c1, .plan .t1'), { autoAlpha: 1, duration: 0.5 }, 12.4); fx.draw(tl, q('.plan .l1'), 12.6, 1.0);
  fx.reveal(tl, q('.stage-card.s2'), 15.8, { x: 40, y: 0, d: 0.9 });
  tl.to(q('.plan .c2, .plan .t2'), { autoAlpha: 1, duration: 0.5 }, 16.2); fx.draw(tl, q('.plan .l2'), 16.4, 1.0);
  if (!fx.reduced) tl.to(q('.plan .c2-dir'), { rotation: 50, transformOrigin: '0 0', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 17.2);
  fx.reveal(tl, q('.stage-card.s3'), 24.0, { x: 40, y: 0, d: 0.9 });
  tl.to(q('.plan .c3, .plan .c4, .plan .t3, .plan .t4'), { autoAlpha: 1, duration: 0.5, stagger: 0.3 }, 24.4);
  fx.draw(tl, q('.plan .l3'), 24.6, 1.0); fx.draw(tl, q('.plan .l4'), 25.2, 1.0);
  // Core statement + privacy states
  fx.reveal(tl, q('.core'), 31.8, { y: 20, d: 1.0 });
  fx.reveal(tl, q('.privacy .chip'), 35.6, { y: 10, d: 0.5, stagger: 0.55 });
  tl.to({}, { duration: 0.01 }, 44);
}

export function Chapter4({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch4', build, reduced);
  return (
    <div ref={ref} className={`scene ch4 ${active ? 'is-active' : ''}`}>
      <Img name="bg-kitchen-soft" className="cover" style={{ filter: 'brightness(0.3)' }} />
      <Img name="ch4-mobile" className="hand" />
      <Img name="ch4-room-camera" className="roomcam" />
      <div className="vignette" />
      <Kicker className="abs kicker" style={{ left: 160, top: 80 }}>The camera roadmap · three stages, one system · none built yet</Kicker>
      <div className="viewfinder">
        <img src={asset('images/pantry-feed.jpg')} alt="" />
        <span className="tag">Phone camera · pantry</span>
        <span className="pt">Pan · tilt · you asked</span>
      </div>
      <div className="plan" aria-hidden="true">
        <svg viewBox="0 0 820 600" preserveAspectRatio="xMidYMid meet">
          {/* simplified home */}
          <rect x="20" y="40" width="780" height="520" rx="10" />
          <line x1="300" y1="40" x2="300" y2="330" /><line x1="20" y1="330" x2="520" y2="330" /><line x1="520" y1="330" x2="520" y2="560" /><line x1="520" y1="200" x2="800" y2="200" />
          <text x="60" y="80">Kitchen</text><text x="340" y="80">Living</text><text x="60" y="370">Hall · desk</text><text x="560" y="80">Bedroom</text><text x="560" y="240">Laundry</text>
          {/* hub */}
          <circle className="hub" cx="410" cy="330" r="16" />
          <text className="t-hub" x="436" y="336">PathSense</text>
          {/* cameras */}
          <circle className="cam c1" cx="160" cy="160" r="14" /><text className="t1" x="182" y="150">1 · phone (with him)</text>
          <line className="link l1" x1="160" y1="160" x2="410" y2="330" />
          <circle className="cam c2" cx="250" cy="280" r="14" /><text className="t2" x="130" y="310">2 · one room camera</text>
          <g className="c2-dir" transform="translate(250 280)"><path d="M0 0 L70 -30 A76 76 0 0 1 70 30 Z" style={{ fill: 'rgba(201,160,84,0.18)', stroke: 'rgba(201,160,84,0.5)' }} /></g>
          <line className="link l2" x1="250" y1="280" x2="410" y2="330" />
          <circle className="cam c3" cx="640" cy="120" r="14" /><text className="t3" x="596" y="160">3 · connected</text>
          <line className="link l3" x1="640" y1="120" x2="410" y2="330" />
          <circle className="cam c4" cx="640" cy="440" r="14" /><text className="t4" x="596" y="480">3 · connected</text>
          <line className="link l4" x1="640" y1="440" x2="410" y2="330" />
        </svg>
      </div>
      <div className="stages">
        <RoadmapPanel className="stage-card s1" n="1" title="Mobile" status="First prototype · our engineering commitment" body="Personal camera-based assistance on the phone he already owns. Find, read labels, describe position, confirm." />
        <RoadmapPanel className="stage-card s2" n="2" title="One room camera" status="Feasibility · only if stage 1 proves useful" body="Potential hands-free assistance: “Check the desk for my keys.” A pan-and-tilt camera looks at an authorised area while he keeps his hands free." limits="Limits: cannot see around obstructions, find hidden items or judge physical safety. Its value over the phone must be tested." />
        <RoadmapPanel className="stage-card s3" n="3" title="Connected home cameras" status="Research · only if stage 2 justifies it" body="Potential multi-room information: “Where were my keys last seen?” The answer must say whether an item is visible now or was previously observed." limits="Never omniscient. No continuous surveillance, no guaranteed detection of people, animals or hazards." />
      </div>
      <div className="abs core"><Headline size="lg">We begin with the phone. <em>We expand only when the next technology proves useful.</em></Headline></div>
      <div className="privacy">
        <StateChip state="active">On because he asked</StateChip>
        <StateChip state="active">Visibly active</StateChip>
        <StateChip state="off">Stop any time</StateChip>
        <StateChip state="neutral">Memory only with approval</StateChip>
        <StateChip state="neutral">Visitors’ privacy protected</StateChip>
        <StateChip state="neutral">Delete stored information</StateChip>
      </div>
      <Veil />
    </div>
  );
}
