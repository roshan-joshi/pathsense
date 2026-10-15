import type { CSSProperties, ReactNode } from 'react';
import { asset } from '../lib/asset';

/* Shared premium design-system components. Pure markup + CSS; motion is applied by scene timelines. */

export const Headline = ({ children, className = '', size = 'xl', style }: { children: ReactNode; className?: string; size?: 'lg' | 'xl' | 'xxl'; style?: CSSProperties }) => (
  <h2 className={`headline headline-${size} ${className}`} style={style}>{children}</h2>
);

export const Caption = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <p className={`cine-caption ${className}`} style={style}>{children}</p>
);

export const Kicker = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) => <p className={`kicker ${className}`} style={style}>{children}</p>;

export const Callout = ({ label, sub, className = '', style, icon }: { label: string; sub?: string; className?: string; style?: CSSProperties; icon?: ReactNode }) => (
  <div className={`callout ${className}`} style={style}>
    {icon && <span className="callout-icon" aria-hidden="true">{icon}</span>}
    <span className="callout-label">{label}</span>
    {sub && <span className="callout-sub">{sub}</span>}
  </div>
);

export const CommandBubble = ({ children, className = '', style, speaker = 'user' }: { children: ReactNode; className?: string; style?: CSSProperties; speaker?: 'user' | 'ai' }) => (
  <div className={`bubble bubble-${speaker} ${className}`} style={style}>
    {speaker === 'user' ? <Waveform /> : <AiDot />}
    <span>{children}</span>
  </div>
);

export const Waveform = () => (
  <span className="waveform" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} />)}</span>
);
export const AiDot = () => <span className="ai-dot" aria-hidden="true" />;

export const StateChip = ({ state, children, className = '', style }: { state: 'verified' | 'uncertain' | 'neutral' | 'active' | 'off'; children: ReactNode; className?: string; style?: CSSProperties }) => (
  <span className={`chip chip-${state} ${className}`} style={style}>
    <i aria-hidden="true" />{children}
  </span>
);

export const ProcessStrip = ({ steps, className = '' }: { steps: string[]; className?: string }) => (
  <ol className={`process ${className}`}>
    {steps.map((s, i) => <li key={s} className="process-step" data-step={i}><span className="process-dot" /><span>{s}</span></li>)}
  </ol>
);

export const RoadmapPanel = ({ n, title, status, body, limits, img, className = '' }: { n: string; title: string; status: string; body: string; limits?: string; img?: string; className?: string }) => (
  <div className={`roadmap ${className}`}>
    {img && <div className="roadmap-img"><img src={img} alt="" /></div>}
    <div className="roadmap-body">
      <div className="roadmap-n">{n}</div>
      <h3>{title}</h3>
      <p className="roadmap-status">{status}</p>
      <p>{body}</p>
      {limits && <p className="roadmap-limits">{limits}</p>}
    </div>
  </div>
);

export const Ribbon = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`ribbon ${className}`}>{children}</div>;

export const Veil = ({ className = '' }: { className?: string }) => <div className={`veil ${className}`} aria-hidden="true" />;

export const Img = ({ name, className = '', style, alt = '' }: { name: string; className?: string; style?: CSSProperties; alt?: string }) => (
  <picture className={`img ${className}`} style={style}>
    <source srcSet={asset(`images/${name}.webp`)} type="image/webp" />
    <img src={asset(`images/${name}.jpg`)} alt={alt} draggable={false} />
  </picture>
);

/* Simple phone mock-up. Children = screen content. */
export const Phone = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <div className={`phone ${className}`} style={style}>
    <div className="phone-screen">{children}</div>
  </div>
);

export const Logo = ({ className = '', style }: { className?: string; style?: CSSProperties }) => (
  <div className={`logo ${className}`} style={style}>
    <span className="logo-mark" aria-hidden="true"><i /></span>
    <span className="logo-word">PATH<b>SENSE</b> <span className="logo-home">HOME</span></span>
  </div>
);
