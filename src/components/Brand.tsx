import { config } from '../content/config';
import { LOGO } from '../content/brand';
import { asset } from '../lib/asset';

/** Decorative glass watermark. Purely visual: hidden from assistive technology, not focusable, never intercepts the pointer. */
export function BrandWatermark({ opacity, boost = 1 }: { opacity: number; boost?: number }) {
  return (
    <div
      className="wm"
      aria-hidden="true"
      data-testid="brand-watermark"
      style={{ opacity, visibility: opacity < 0.01 ? 'hidden' : 'visible', transform: boost > 1.001 ? `scale(${boost})` : undefined }}
    >
      <img src={asset(LOGO.file)} alt="" width={LOGO.width} height={LOGO.height} draggable={false} decoding="async" />
    </div>
  );
}

/** Presenting / contact organisation. Real text and real links (mailto and website), sized in `em` so it works
 *  on the 1920×1080 stage and in the responsive end panel alike. */
export function ContactCard({ className = '' }: { className?: string }) {
  const c = config.contact;
  return (
    <div className={`contact-card ${className}`} role="group" aria-label={`Presented by ${c.name}`} data-testid="contact-card">
      <img className="contact-logo" src={asset(LOGO.file)} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} draggable={false} />
      <div className="contact-text">
        <p className="contact-kicker">Presented by</p>
        <p className="contact-name">{c.name}</p>
        <p className="contact-links">
          <a href={`mailto:${c.email}`}>{c.email}</a>
          <span className="contact-sep" aria-hidden="true">·</span>
          <a href={c.website} target="_blank" rel="noopener noreferrer">{c.websiteLabel}<span className="visually-hidden"> (opens in a new tab)</span></a>
        </p>
      </div>
    </div>
  );
}
