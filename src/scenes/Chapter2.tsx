import { useScene } from '../app/useScene';
import { Headline, Img, Kicker, Veil } from '../components/ui';
import type { Fx } from '../timeline/fx';
import type gsap from 'gsap';

/* Chapter 2 — The tasks that matter (40s) */
const TASKS = ['Finding the coffee', 'Milk or juice?', 'Keys and the remote', 'A letter on the bench', 'What is in the fridge', 'What is in the pantry', 'Which laundry bottle', 'Simple daily routines'];

const TILES: { cls: string; img?: string; label: string; x: number; y: number; w: number; h: number }[] = [
  { cls: 't-keys', img: 'tile-keys', label: 'Keys on the table', x: 120, y: 330, w: 520, h: 300 },
  { cls: 't-pantry', img: 'ch1-hand-jar', label: 'Coffee in the pantry', x: 680, y: 330, w: 400, h: 300 },
  { cls: 't-fridge', img: 'tile-fridge-milk', label: 'Milk in the fridge', x: 1120, y: 330, w: 680, h: 300 },
  { cls: 't-letter', label: 'A letter on the counter', x: 120, y: 670, w: 360, h: 300 },
  { cls: 't-laundry', img: 'tile-laundry', label: 'Laundry products', x: 520, y: 670, w: 560, h: 300 },
  { cls: 't-bin', img: 'tile-bin', label: 'Bins and the garden', x: 1120, y: 670, w: 680, h: 300 },
];

function build({ q, tl, fx }: { q: gsap.utils.SelectorFunc; tl: gsap.core.Timeline; fx: Fx }) {
  tl.set(q('.tile, .tasklist .pill, .statement, .bd, .fc, .ring, .chain .pill, .chain .arrow, .kicker, .not'), { autoAlpha: 0 });
  fx.lightIn(tl, q('.veil'), 0, 1.0);
  fx.reveal(tl, q('.kicker'), 0.5, { y: 10 });
  // Ordinary tasks list
  fx.reveal(tl, q('.tasklist .pill'), 1.0, { y: 14, d: 0.6, stagger: 0.42 });
  // Tiles assemble like a connected home
  fx.reveal(tl, q('.t-pantry'), 3.6, { y: 30, scale: 0.96, d: 0.9 });
  fx.reveal(tl, q('.t-keys'), 7.2, { y: 30, scale: 0.96, d: 0.9 });
  fx.reveal(tl, q('.t-letter'), 8.6, { y: 30, scale: 0.96, d: 0.9 });
  fx.reveal(tl, q('.t-fridge'), 11.0, { y: 30, scale: 0.96, d: 0.9 });
  fx.reveal(tl, q('.t-laundry'), 13.4, { y: 30, scale: 0.96, d: 0.9 });
  fx.reveal(tl, q('.t-bin'), 14.6, { y: 30, scale: 0.96, d: 0.9 });
  tl.set(q('.tasklist'), { zIndex: 3 }, 0);
  // Hide the list and the tiles; big statement
  fx.hide(tl, q('.tasklist .pill'), 16.2, { stagger: 0.04, d: 0.5 });
  fx.hide(tl, q('.kicker'), 16.2);
  tl.to(q('.tile'), { autoAlpha: 0.18, scale: 0.98, duration: 1.2, ease: 'power2.inOut', stagger: 0.05 }, 16.4);
  fx.reveal(tl, q('.statement'), 17.0, { y: 30, d: 1.2 });
  fx.hide(tl, q('.statement'), 23.0);
  tl.to(q('.tile'), { autoAlpha: 0, duration: 0.8 }, 23.0);

  // Object-to-object chain: jar -> milk -> cup (match-cut via the amber ring moving between objects)
  tl.fromTo(q('.bd-pantry'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 23.6);
  tl.fromTo(q('.fc-pantry'), { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1.0, duration: 1.0, ease: 'power2.out' }, 23.6);
  tl.set(q('.ring'), { left: 1210, top: 300 }, 23.6);
  tl.fromTo(q('.ring'), { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 23.9);
  fx.reveal(tl, q('.c1'), 24.2, { y: 12, d: 0.6 });
  tl.fromTo(q('.bd-fridge'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 26.3);
  tl.fromTo(q('.fc-fridge'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1.0, duration: 1.0, ease: 'power2.inOut' }, 26.3);
  tl.to(q('.fc-pantry'), { autoAlpha: 0, duration: 0.6 }, 26.6);
  tl.to(q('.ring'), { left: 1190, top: 560, duration: 1.0, ease: 'power2.inOut' }, 26.3);
  fx.reveal(tl, q('.c1a, .c2'), 26.9, { y: 12, d: 0.6, stagger: 0.1 });
  tl.fromTo(q('.bd-cup'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 28.3);
  tl.fromTo(q('.fc-cup'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1.0, duration: 1.0, ease: 'power2.inOut' }, 28.3);
  tl.to(q('.fc-fridge'), { autoAlpha: 0, duration: 0.6 }, 28.6);
  tl.to(q('.ring'), { left: 1120, top: 600, duration: 1.0, ease: 'power2.inOut' }, 28.3);
  fx.reveal(tl, q('.c2a, .c3'), 28.9, { y: 12, d: 0.6, stagger: 0.1 });
  fx.push(tl, q('.fc-cup'), 29.3, { from: 1.0, to: 1.04, d: 10 });
  tl.to(q('.ring'), { autoAlpha: 0, duration: 0.8 }, 30.6);
  fx.reveal(tl, q('.not'), 30.0, { y: 24, d: 1.0 });
  tl.to({}, { duration: 0.01 }, 40);
}

export function Chapter2({ active, reduced }: { active: boolean; reduced: boolean }) {
  const ref = useScene('ch2', build, reduced);
  return (
    <div ref={ref} className={`scene ch2 ${active ? 'is-active' : ''}`}>
      <Img name="bg-kitchen-soft" className="cover" style={{ filter: 'brightness(0.35)' }} />
      <div className="vignette" />
      <Kicker className="abs kicker" style={{ left: 120, top: 90 }}>Everyday home tasks that matter</Kicker>
      <div className="tasklist">{TASKS.map((t) => <span key={t} className="pill">{t}</span>)}</div>
      {TILES.map((t) => (
        <div key={t.cls} className={`tile ${t.cls} ${t.img ? '' : 'letter'}`} style={{ left: t.x, top: t.y, width: t.w, height: t.h }}>
          {t.img ? <img src={`images/${t.img}.jpg`} alt="" /> : (
            <svg viewBox="0 0 120 80" aria-hidden="true"><rect x="8" y="12" width="104" height="60" rx="6" fill="#f4ece0" /><path d="M8 18 L60 50 L112 18" fill="none" stroke="#c9a054" strokeWidth="3" /><rect x="20" y="52" width="40" height="4" fill="#d9cfbf" /></svg>
          )}
          <span className="lbl">{t.label}</span>
        </div>
      ))}
      <div className="abs statement">
        <Headline size="xl">The challenge is not simply <em>identifying</em> an object.</Headline>
        <Headline size="xl" style={{ marginTop: 24 }}>It is <em>accomplishing the task</em> that matters.</Headline>
      </div>
      {/* Object chain: blurred backdrop + sharp focus card for each object */}
      <div className="bd bd-pantry"><img src="images/ch1-hand-jar.jpg" alt="" /></div>
      <div className="bd bd-fridge"><img src="images/tile-fridge-milk.jpg" alt="" /></div>
      <div className="bd bd-cup"><img src="images/ch2-pour-detail.jpg" alt="" /></div>
      <div className="fc fc-pantry" style={{ left: 640, top: 150, width: 640, height: 640 }}><img src="images/ch1-hand-jar.jpg" alt="" /></div>
      <div className="fc fc-fridge" style={{ left: 560, top: 300, width: 800, height: 385 }}><img src="images/tile-fridge-milk.jpg" alt="" /></div>
      <div className="fc fc-cup" style={{ left: 560, top: 170, width: 800, height: 640 }}><img src="images/ch2-pour-detail.jpg" alt="" /></div>
      <div className="grad-bottom" />
      <div className="ring" />
      <div className="chain">
        <span className="pill c1">Coffee · pantry, middle shelf</span>
        <span className="arrow c1a" style={{ color: 'var(--ink-3)', fontSize: 30 }}>→</span>
        <span className="pill c2">Milk · fridge door</span>
        <span className="arrow c2a" style={{ color: 'var(--ink-3)', fontSize: 30 }}>→</span>
        <span className="pill c3">Cup · on the counter</span>
      </div>
      <div className="abs not" style={{ left: 120, top: 150, width: 1100 }}>
        <Kicker>One task, several objects</Kicker>
        <Headline size="lg" style={{ marginTop: 14 }}>Not detection. <em>Completion.</em></Headline>
      </div>
      <Veil />
    </div>
  );
}
