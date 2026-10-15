import timing from './narration-timing.json';

export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7';

export interface SubtitleLine { text: string; start: number; end: number }

export interface ChapterDef {
  id: ChapterId;
  index: number;
  number: string;
  title: string;
  kicker: string;
  /** Visual duration in seconds. Narration audio for the chapter is never longer than this. */
  duration: number;
  /** On-screen key messages (silent mode relies on these). */
  keyMessages: string[];
  /** Presenter notes. */
  notes: string[];
  /** Description of the visuals for the accessible reading mode. */
  visual: string;
  subtitles: SubtitleLine[];
  narrationFile: string;
}

const sub = (id: ChapterId): SubtitleLine[] => timing.chapters.find((c) => c.id === id)!.lines;
const narrationDuration = (id: ChapterId) => timing.chapters.find((c) => c.id === id)!.duration;

const base: Omit<ChapterDef, 'index' | 'subtitles' | 'narrationFile'>[] = [
  {
    id: 'ch1', number: '01', title: 'A life built around familiarity', kicker: 'The person', duration: 46,
    keyMessages: ['Years running a café. He knew where everything belonged.', 'Then his vision changed.', 'The knowledge stayed. The information moved out of reach.', 'PATHSENSE HOME — From understanding surroundings to completing everyday tasks.'],
    notes: [
      'The story opens from black with sound first: a respectful emergence from absence of information, not a claim about what blind people see.',
      'The character is a fictional former café owner, representative of real accessibility needs. Present him as an illustrative, fictional character.',
      'Name what he already uses well: cane, training, a voice assistant, touch and memory. PathSense does not replace any of this. Frame the gap as information access, not capability.',
    ],
    visual: 'The screen is black. Faint room sound arrives first: a kettle, a fridge door. Soft blurred light and the outlines of a home kitchen slowly emerge and sharpen into morning light. A man in a dark shirt and brown apron, a tea towel over his shoulder, reaches into open pantry shelves of jars. On the bench sit a kettle, a speckled cup and a smartphone; a white cane leans against the island. Short lines appear in turn: "Years running a café. He knew where everything belonged.", "Then his vision changed.", "The knowledge stayed. The information moved out of reach." Small labels mark what he uses today: a cane and training, a voice assistant, touch, memory and years of kitchen knowledge. The scene dims and the title PATHSENSE HOME appears with the line "From understanding surroundings to completing everyday tasks."',
  },
  {
    id: 'ch2', number: '02', title: 'Everyday home tasks that matter', kicker: 'The problem', duration: 40,
    keyMessages: ['Coffee · Milk · Keys and the remote · Fridge and pantry · Laundry products · Letters · Daily routines', 'The challenge is not simply identifying an object. It is accomplishing the task that matters.'],
    notes: [
      'These tasks are drawn from real accessibility needs, framed through the fictional café owner. Read a few aloud; they are deliberately ordinary.',
      'Key distinction for funders: many apps describe objects. PathSense is about completing the task the object belongs to.',
      'The jar → fridge → cup transition is the visual metaphor for a task chain.',
    ],
    visual: 'A montage of the same home: keys on a wooden tray, a hand on jars in the pantry, a man taking a milk bottle from the fridge, laundry bottles beside a washing machine, a wheelie bin on the drive, and a stylised letter on the counter. Each tile carries a short label naming an everyday task. The montage narrows to a chain of three objects — coffee jar, milk, cup — and the kettle pouring into the cup, with the statement: "The challenge is not simply identifying an object. It is accomplishing the task that matters."',
  },
  {
    id: 'ch3', number: '03', title: 'The first solution: find the coffee', kicker: 'Stage 1 — mobile camera (simulated)', duration: 60,
    keyMessages: ['"PathSense, help me find the coffee."', 'Goal: Find coffee', 'Possible coffee container — middle shelf, toward the right. Uncertain until checked.', 'Coffee found. Confirmed by him.', 'One spoken goal. Relevant assistance. A verified result.'],
    notes: [
      'This is the centrepiece and the first real engineering commitment: a smartphone-only prototype.',
      'Say clearly that this is a simulation of the intended experience. No real trial has been recorded.',
      'Emphasise the loop: Understand the goal → Acquire relevant information → Assist → Verify → Continue → Confirm outcome. The person verifies; the AI states uncertainty.',
      'Optional: press T to open the interactive simulation ("Try the proposed experience"). It pauses the story.',
      'Hot water, gas and appliances stay the person\'s own steps; we do not claim the AI supervises them.',
    ],
    visual: 'The man speaks to his phone; a speech bubble shows "PathSense, help me find the coffee." A phone interface appears with the goal "Find coffee" and a six-step progress strip: Understand, Acquire, Assist, Verify, Continue, Confirm. The phone camera shows pantry shelves; a soft scan passes over them and a dashed amber outline marks one jar labelled "possible coffee container — uncertain". The spoken reply reads: "I can see what looks like a coffee container on the middle shelf, toward the right. Can you check it?" His hand reaches to the jar; the state changes to "Coffee found. Confirmed by him." with a verified mark. A ribbon reads "Simulated interaction". A final line: "One spoken goal. Relevant assistance. A verified result." and a faded continuation: Find cup → Find milk → Approved routine (future).',
  },
  {
    id: 'ch4', number: '04', title: 'Three stages of PathSense', kicker: 'The camera roadmap', duration: 44,
    keyMessages: ['1 — MOBILE: personal camera-based assistance (first prototype)', '2 — ONE ROOM CAMERA: potential hands-free visual assistance (feasibility)', '3 — CONNECTED HOME CAMERAS: potential multi-room information (research)', 'We begin with the phone. We expand only when the next technology proves useful.'],
    notes: [
      'Three stages, one system. Stage 2 and 3 are extensions, not separate products, and none of it is built yet.',
      'Stage 2 limitation: a fixed camera cannot see around obstructions, find hidden items or judge physical safety. Its value over the phone must be tested.',
      'Stage 3 must distinguish "visible now" from "last seen". No omniscience, no continuous surveillance.',
      'Privacy states on screen: on because he asked, visibly active, user-controlled stop, approved memory only.',
    ],
    visual: 'The phone in his hand grows into a camera frame that detaches and becomes the view from a small pan-and-tilt room camera on a shelf above a cooking bench. The view pulls back into a simplified floor plan of a home with three camera points and one central PathSense hub connected by thin lines. Three stage panels read: 1 Mobile, 2 One room camera, 3 Connected home cameras, each with a status (first prototype, feasibility, research) and its limits. Privacy chips show: "On because you asked", "Visibly active", "Stop any time", "Memory only with approval".',
  },
  {
    id: 'ch5', number: '05', title: 'Personalised assistance', kicker: 'Personalisation', duration: 35,
    keyMessages: ['Language · Speaking speed · Instruction detail · Familiar locations · Current goal · Remembered information · Privacy', 'PathSense should adapt to the person — not the other way around.'],
    notes: [
      'The café owner knows kitchens; he may want brief, direct prompts. Another person may want step-by-step detail.',
      'Personalisation is based on explicit preferences and user-controlled information. Nothing is inferred from camera imagery about mood, ability or health.',
    ],
    visual: 'Two preference profiles sit side by side. The café owner\'s profile shows "Instruction detail: brief", "Speaking speed: faster", "Familiar locations: coffee — pantry, middle shelf". A second, anonymous profile shows "Instruction detail: step by step", "Speaking speed: slower", "Language: user\'s choice". Shared switches show Current goal, Remembered information (user-controlled) and Privacy. The line "PathSense should adapt to the person — not the other way around" appears with a note: "Based on explicit preferences, never inferred from camera imagery."',
  },
  {
    id: 'ch6', number: '06', title: 'How we prove it truly helps', kicker: 'Evaluation', duration: 42,
    keyMessages: ['Understand current methods → Select a real problem → Build a limited prototype → Test with willing participants → Measure → Improve', 'Right item found? Task completed? Help required? Easier than today? Safety or accuracy failures? Use it again?', "We don't measure success by how impressive the AI looks. We measure whether everyday independence improves."],
    notes: [
      'The co-design image is conceptual; no sessions have taken place yet.',
      'Walk through the six research steps and the six plain-language measures. There are no scores, and we will not invent any.',
      'This is where the organisation\'s expertise matters most: participant access, ethics, rehabilitation knowledge.',
    ],
    visual: 'A conceptual co-design session around a kitchen table: the café owner, an accessibility specialist with a tablet, a man wearing dark glasses, and an older woman with a white cane, labelled "Conceptual co-design session — illustrative". A six-step research path animates: Understand current methods, Select a real problem, Build a limited prototype, Test with willing participants, Measure outcomes, Improve on evidence. Six measurement cards each show a question and the status "To be measured", with no numbers.',
  },
  {
    id: 'ch7', number: '07', title: 'One home. Many futures.', kicker: 'The partnership', duration: 50,
    keyMessages: ['Start with one real problem. Build a platform that can support many.', 'We invite your organisation to help us co-design, evaluate and responsibly develop PathSense.', 'Community co-design · Accessibility and rehabilitation expertise · Feasibility prototype testing · Funding or funding-partner support', 'PATHSENSE HOME — Independence, one meaningful task at a time.', 'Partner with us to validate the first real-world prototype.'],
    notes: [
      'Return to the café owner: the conceptual outcome is small and real — coffee found, confirmed by him.',
      'Expand to other hypothetical homes without stereotypes: belongings, ingredients, documents, routines, communication preferences.',
      'State the ask plainly: co-design, accessibility and rehabilitation expertise, feasibility testing, funding or funding-partner support. Then invite questions.',
      'Contact details are configurable in src/content/config.ts.',
    ],
    visual: 'The café owner, smiling, holds a cup in his kitchen; a small verified chip reads "Coffee found · confirmed by him · conceptual outcome". The view widens to a constellation of other homes with portraits of different people — an older woman with a jar, a man in dark glasses pouring from a kettle, a woman reading a label, an older man with a plant — labelled with future possibilities: finding belongings, identifying ingredients, reading documents, household routines, communication preferences. The headline "Start with one real problem. Build a platform that can support many." gives way to the partnership request and four asks, then the closing title PATHSENSE HOME, "Independence, one meaningful task at a time", and the invitation "Partner with us to validate the first real-world prototype" with configurable contact lines.',
  },
];

export const chapters: ChapterDef[] = base.map((c, i) => {
  const nd = narrationDuration(c.id);
  if (nd > c.duration) throw new Error(`${c.id}: narration (${nd}s) longer than chapter duration (${c.duration}s)`);
  return { ...c, index: i, subtitles: sub(c.id), narrationFile: `audio/${c.id}.m4a` };
});

export const chapterStart = (index: number) => chapters.slice(0, index).reduce((a, c) => a + c.duration, 0);
export const totalDuration = chapterStart(chapters.length);

export const PROCESS_STEPS = ['Understand the goal', 'Acquire relevant information', 'Assist', 'Verify', 'Continue', 'Confirm outcome'];
