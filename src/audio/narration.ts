import type { ChapterDef } from '../content/story';

/**
 * Narration playback. One <audio> element per chapter, preloaded.
 * Returns `false` from playChapter() when the browser blocks playback (autoplay policy),
 * so the engine can fall back to its own clock and the UI can explain.
 */
export class NarrationPlayer {
  private els = new Map<string, HTMLAudioElement>();
  private active: string | null = null;
  private ended = new Set<string>();

  constructor(chapters: ChapterDef[]) {
    chapters.forEach((c) => {
      const a = new Audio(c.narrationFile);
      a.preload = 'auto';
      a.addEventListener('ended', () => this.ended.add(c.id));
      a.addEventListener('error', () => { /* file missing: silent fallback, engine clock continues */ });
      this.els.set(c.id, a);
    });
  }

  async playChapter(id: string, offset: number, restart: boolean): Promise<boolean> {
    const el = this.els.get(id); if (!el) return false;
    if (this.active && this.active !== id) this.els.get(this.active)?.pause();
    this.active = id;
    if (offset >= (el.duration || Infinity)) { el.pause(); this.ended.add(id); return true; }
    this.ended.delete(id);
    if (restart || Math.abs(el.currentTime - offset) > 0.35) { try { el.currentTime = offset; } catch { /* not ready yet */ } }
    try { await el.play(); return true; } catch { return false; }
  }

  /** Seconds into the active chapter's audio, or -1 when audio is not driving time. */
  currentTime(id: string): number {
    const el = this.els.get(id);
    if (!el || this.active !== id || el.paused || el.ended || this.ended.has(id) || !isFinite(el.duration)) return -1;
    return el.currentTime;
  }

  pause() { this.els.forEach((a) => a.pause()); }
  destroy() { this.pause(); this.els.clear(); }
}
