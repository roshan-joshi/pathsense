import type gsap from 'gsap';
type Timeline = gsap.core.Timeline;
import { chapters, chapterStart, totalDuration, type ChapterDef } from '../content/story';
import { NarrationPlayer } from '../audio/narration';

export interface EngineState {
  started: boolean;
  playing: boolean;
  ended: boolean;
  time: number;          // global seconds
  chapterIndex: number;
  local: number;         // seconds into the chapter
  narration: boolean;
  captions: boolean;
  reducedMotion: boolean;
  audioBlocked: boolean;
}

type Listener = (s: EngineState) => void;

/**
 * Deterministic presentation engine.
 * One global clock drives per-chapter GSAP timelines by seeking (`tl.time(local)`),
 * so play/pause/seek/jump and frame-by-frame rendering all behave identically.
 * When narration is on and the chapter audio is actually playing, the audio element
 * is the master clock to avoid drift; otherwise requestAnimationFrame is used.
 */
export class Engine {
  readonly chapters: ChapterDef[] = chapters;
  readonly total = totalDuration;
  private timelines = new Map<string, Timeline>();
  private listeners = new Set<Listener>();
  private raf = 0;
  private last = 0;
  private narrationPlayer: NarrationPlayer | null;
  state: EngineState;

  constructor(opts: { renderMode?: boolean; reducedMotion?: boolean } = {}) {
    const reduced = opts.reducedMotion ?? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    this.state = { started: false, playing: false, ended: false, time: 0, chapterIndex: 0, local: 0, narration: !opts.renderMode, captions: true, reducedMotion: !!reduced, audioBlocked: false };
    this.narrationPlayer = opts.renderMode ? null : new NarrationPlayer(this.chapters);
  }

  // ---- registration -------------------------------------------------------
  registerTimeline(id: string, tl: Timeline) {
    tl.pause();
    this.timelines.set(id, tl);
    this.applyTime();
  }
  unregisterTimeline(id: string) { const tl = this.timelines.get(id); tl?.kill(); this.timelines.delete(id); }

  subscribe(fn: Listener) { this.listeners.add(fn); fn(this.state); return () => { this.listeners.delete(fn); }; }
  private emit() { const snapshot = { ...this.state }; this.listeners.forEach((l) => l(snapshot)); }

  // ---- transport ----------------------------------------------------------
  start(opts: { narration: boolean; captions: boolean }) {
    this.state.started = true; this.state.narration = opts.narration; this.state.captions = opts.captions;
    this.seek(0); this.play();
  }
  play() {
    if (this.state.ended) this.seek(0);
    this.state.playing = true; this.state.ended = false;
    this.last = performance.now();
    this.syncAudio(true);
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.tick);
    this.emit();
  }
  pause() {
    this.state.playing = false; cancelAnimationFrame(this.raf);
    this.narrationPlayer?.pause();
    this.emit();
  }
  toggle() { this.state.playing ? this.pause() : this.play(); }
  restart() { this.seek(0); this.play(); }
  seek(t: number) {
    const clamped = Math.max(0, Math.min(this.total, t));
    const prev = this.state.chapterIndex;
    this.state.time = clamped; this.state.ended = false;
    this.updateChapter();
    this.applyTime();
    if (this.state.playing) this.syncAudio(prev !== this.state.chapterIndex || true);
    else this.narrationPlayer?.pause();
    this.emit();
  }
  jumpTo(index: number) { const i = Math.max(0, Math.min(this.chapters.length - 1, index)); this.seek(chapterStart(i)); if (!this.state.playing && this.state.started) this.play(); }
  next() { this.jumpTo(this.state.chapterIndex + 1); }
  prev() { const { local, chapterIndex } = this.state; this.jumpTo(local > 2.5 ? chapterIndex : chapterIndex - 1); }
  setNarration(on: boolean) { this.state.narration = on; if (!on) this.narrationPlayer?.pause(); else if (this.state.playing) this.syncAudio(true); this.emit(); }
  setCaptions(on: boolean) { this.state.captions = on; this.emit(); }
  setReducedMotion(on: boolean) { this.state.reducedMotion = on; this.emit(); }

  /** Render-mode hook: set the global time without audio or rAF. */
  renderAt(t: number) { this.state.started = true; this.state.time = Math.max(0, Math.min(this.total, t)); this.updateChapter(); this.applyTime(); this.emit(); }

  destroy() { cancelAnimationFrame(this.raf); this.narrationPlayer?.destroy(); this.timelines.forEach((tl) => tl.kill()); this.timelines.clear(); this.listeners.clear(); }

  // ---- internals ----------------------------------------------------------
  private updateChapter() {
    let i = 0;
    while (i < this.chapters.length - 1 && this.state.time >= chapterStart(i + 1)) i++;
    this.state.chapterIndex = i;
    this.state.local = this.state.time - chapterStart(i);
  }
  private applyTime() {
    const active = this.chapters[this.state.chapterIndex].id;
    this.timelines.forEach((tl, id) => {
      if (id === active) tl.time(this.state.local, false);
    });
  }
  private syncAudio(restart: boolean) {
    const p = this.narrationPlayer; if (!p) return;
    if (!this.state.narration) { p.pause(); return; }
    const ch = this.chapters[this.state.chapterIndex];
    p.playChapter(ch.id, this.state.local, restart).then((ok) => {
      if (!ok && !this.state.audioBlocked) { this.state.audioBlocked = true; this.emit(); }
      if (ok && this.state.audioBlocked) { this.state.audioBlocked = false; this.emit(); }
    });
  }
  private tick = (now: number) => {
    if (!this.state.playing) return;
    const dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
    const ch = this.chapters[this.state.chapterIndex];
    const audioT = this.state.narration ? this.narrationPlayer?.currentTime(ch.id) : null;
    let t: number;
    if (audioT != null && audioT >= 0) t = chapterStart(this.state.chapterIndex) + audioT;   // audio is master
    else t = this.state.time + dt;
    const prevChapter = this.state.chapterIndex;
    this.state.time = t;
    if (t >= this.total) {
      this.state.time = this.total; this.updateChapter(); this.applyTime();
      this.state.playing = false; this.state.ended = true; this.narrationPlayer?.pause(); this.emit(); return;
    }
    this.updateChapter(); this.applyTime();
    if (this.state.chapterIndex !== prevChapter) this.syncAudio(true);
    this.emit();
    this.raf = requestAnimationFrame(this.tick);
  };
}
