import { chapters, totalDuration } from '../content/story';
import { proposal } from '../content/proposal';
import { config } from '../content/config';
import { fmt } from '../timeline/fx';

/** Mode D — Accessible reading mode. First-class structured version of the whole proposal. */
export function ReadingMode() {
  const c = config.contact;
  const contactLines = [c.name, c.email, c.phone, c.website].filter(Boolean);
  return (
    <main className="reading" id="main">
      <nav aria-label="Reading mode navigation" className="reading-nav">
        <a href="#/" className="btn">← Back to the cinematic presentation</a>
        <ul>
          <li><a href="#story">The story</a></li><li><a href="#client">The client</a></li><li><a href="#system">The proposed system</a></li><li><a href="#roadmap">Roadmap</a></li><li><a href="#evaluation">Evaluation</a></li><li><a href="#safety">Safety and privacy</a></li><li><a href="#partnership">Partnership</a></li><li><a href="#transcript">Transcript</a></li><li><a href="#funding">Funding appendix</a></li>
        </ul>
      </nav>
      <header>
        <p className="kicker">Accessible reading mode</p>
        <h1>PathSense Home</h1>
        <p className="lede">Independence, one meaningful task at a time. A proposal to co-design and evaluate a personalised AI task-assistance platform with an Australian organisation supporting people who are blind or have low vision.</p>
        <p className="fine">{config.disclosure} The cinematic presentation runs for about {fmt(totalDuration)}. Everything it says is written here.</p>
      </header>

      <section id="story" aria-labelledby="h-story">
        <h2 id="h-story">The story in seven chapters</h2>
        {chapters.map((ch) => (
          <article key={ch.id} aria-labelledby={`h-${ch.id}`}>
            <h3 id={`h-${ch.id}`}>{ch.number} · {ch.title} <span className="muted">({fmt(ch.duration)})</span></h3>
            <p><strong>What is on screen.</strong> {ch.visual}</p>
            <p><strong>Narration.</strong> {ch.subtitles.map((l) => l.text).join(' ')}</p>
            <ul aria-label="Key messages">{ch.keyMessages.map((k) => <li key={k}>{k}</li>)}</ul>
          </article>
        ))}
      </section>

      <section id="client" aria-labelledby="h-client">
        <h2 id="h-client">The person: whom PathSense is initially designed to help</h2>
        <p>{proposal.client.summary}</p>
        <h3>What he uses today</h3><ul>{proposal.client.currentMethods.map((m) => <li key={m}>{m}</li>)}</ul>
        <h3>Everyday tasks the story focuses on</h3><ul>{proposal.client.reportedNeeds.map((m) => <li key={m}>{m}</li>)}</ul>
        <p className="fine">{proposal.client.boundaries}</p>
      </section>

      <section id="system" aria-labelledby="h-system">
        <h2 id="h-system">What PathSense is: the proposed system</h2>
        <p>{proposal.system.definition}</p>
        <p><strong>The loop:</strong> {proposal.system.loop.join(' → ')}.</p>
        <dl>{proposal.system.components.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <h3>Why task completion matters more than object detection</h3>
        <p>{proposal.system.differentiation}</p>
        <p><strong>Key strategic question:</strong> {proposal.system.keyQuestion}</p>
      </section>

      <section id="roadmap" aria-labelledby="h-roadmap">
        <h2 id="h-roadmap">Three stages, one system</h2>
        {proposal.roadmap.map((r) => (
          <article key={r.stage}>
            <h3>Stage {r.stage} · {r.name} <span className="muted">— {r.status}</span></h3>
            <p>{r.summary}</p>
            <h4>Potential functions</h4><ul>{r.functions.map((f) => <li key={f}>{f}</li>)}</ul>
            <h4>Limits</h4><ul>{r.limits.map((f) => <li key={f}>{f}</li>)}</ul>
          </article>
        ))}
        <p><strong>Why start with a smartphone?</strong> He already owns one; it is practical and affordable; and it lets us test the core loop before adding cameras, complexity and privacy considerations.</p>
      </section>

      <section id="personalisation" aria-labelledby="h-pers">
        <h2 id="h-pers">Personal to every individual</h2>
        <p>Preferences: {proposal.personalisation.preferences.join(', ')}.</p>
        <p>{proposal.personalisation.principle}</p>
      </section>

      <section id="evaluation" aria-labelledby="h-eval">
        <h2 id="h-eval">Does it truly work? What will be tested</h2>
        <ol>{proposal.evaluation.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <h3>Measures</h3><ul>{proposal.evaluation.measures.map((s) => <li key={s}>{s}</li>)}</ul>
        <p><strong>Status:</strong> {proposal.evaluation.status}</p>
      </section>

      <section id="safety" aria-labelledby="h-safety">
        <h2 id="h-safety">Safety, uncertainty and privacy</h2>
        <h3>PathSense does not claim to be able to</h3><ul>{proposal.safety.notClaimed.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3>Commitments</h3><ul>{proposal.safety.commitments.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3>Home-camera privacy</h3><ul>{proposal.safety.privacy.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section id="partnership" aria-labelledby="h-partner">
        <h2 id="h-partner">The partnership we are requesting</h2>
        <p>{proposal.partnership.invitation}</p>
        <ul>{proposal.partnership.asks.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3>Proposed pathway</h3>
        <ol>{proposal.partnership.pathway.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}</ol>
        <h3>We are seeking a discussion about</h3><ul>{proposal.partnership.discussion.map((s) => <li key={s}>{s}</li>)}</ul>
        <p><strong>Next step:</strong> {proposal.partnership.nextStep}</p>
        <p>{contactLines.length ? contactLines.join(' · ') : 'Contact details: to be configured by the presenter (src/content/config.ts).'}</p>
      </section>

      <section id="transcript" aria-labelledby="h-transcript">
        <h2 id="h-transcript">Full narration transcript</h2>
        {chapters.map((ch) => (
          <div key={ch.id}><h3>{ch.number} · {ch.title}</h3>{ch.subtitles.map((l, i) => <p key={i}><span className="muted">{fmt(l.start)}</span> {l.text}</p>)}</div>
        ))}
      </section>

      <section id="funding" aria-labelledby="h-funding">
        <h2 id="h-funding">Optional funding appendix (editable placeholders)</h2>
        <p className="fine">No dollar figures or commitments have been invented. Fill these in with the partner.</p>
        <table><thead><tr><th scope="col">Item</th><th scope="col">Placeholder</th></tr></thead>
          <tbody>{proposal.fundingAppendix.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
      </section>
      <footer><p className="fine">{config.disclosure}</p></footer>
    </main>
  );
}
