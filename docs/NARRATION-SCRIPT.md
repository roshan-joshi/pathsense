# Narration script (revision v2)

**Voice delivered:** Kokoro-82M neural text-to-speech (Apache-2.0 model, run locally in Node via `kokoro-js`), voice `bf_emma` (warm, British-accented English), speed 0.92, with 0.55 s pauses between lines and loudness-normalised to −18 LUFS. Chapter 1 has a quiet synthetic room-tone bed (generated brown noise, no recordings) under its 9-second lead-in. Total narration 293 s inside a 317 s timeline.

This is still synthesised speech, not a voice actor. It is markedly more natural than the v1 macOS "Karen" voice. No Australian-accented Kokoro voice exists; the British voice was chosen over the (slightly higher-rated) American ones for tonal fit with an Australian audience.

## Trying another voice
```
NARRATION_VOICE=af_heart npm run narration     # highest-rated Kokoro voice (American, female)
NARRATION_VOICE=bm_george npm run narration    # British, male
NARRATION_SPEED=0.9 npm run narration          # slower
```
Then `npm run build && npm run export:offline`. Voices available: af_heart af_bella af_nicole af_sarah … bf_emma bf_isabella bf_alice bf_lily bm_george bm_lewis bm_daniel bm_fable am_michael am_adam …

## Replacing with a professional recording
Record each chapter as one file (`ch1.m4a` … `ch7.m4a`), keep each shorter than its chapter duration in `src/content/story.ts` (46, 40, 60, 44, 35, 42, 50 s), and update the line start/end seconds in `src/content/narration-timing.json` so captions stay in sync.

## Script

### Chapter 1 — A life built around familiarity (narration starts at 9 s, after the sound-first opening)

1. Before anything is seen, there is sound. A kettle. A fridge door. A room known by heart.
2. For years, he ran a small café. He knew where everything belonged.
3. Then his vision changed.
4. The knowledge stayed. What moved out of reach was information. What is on the shelf. Which carton is which. Where the keys were left.
5. He already has his own ways. A cane. Training. A voice assistant. His hands, and his memory of the place.
6. PathSense Home is a proposal to put the missing information back within reach.

### Chapter 2 — Everyday home tasks that matter

1. The tasks that matter most are ordinary ones.
2. Finding the coffee. Telling the milk from the juice. Keys, the remote, a letter on the bench.
3. What is in the fridge and the pantry. Which bottle is for the washing. The simple routines that make a morning.
4. Plenty of tools can describe an object. The harder problem is finishing the task the object belongs to.
5. A jar is only useful once you know it is the coffee, it is within reach, and the milk is in the fridge.
6. That is the problem PathSense sets out to help with. Not detection. Completion.

### Chapter 3 — PathSense helps find coffee

1. Here is the first thing we intend to build.
2. One spoken goal. PathSense, help me find the coffee.
3. The phone understands the goal, then asks for the view it needs.
4. He points the camera at the pantry. The system looks for a likely match, and says what it sees without pretending to be certain.
5. I can see what looks like a coffee container on the middle shelf, towards the right.
6. He reaches, checks the jar by hand, and confirms.
7. Coffee found. Confirmed by him.
8. Everything you have just watched is a simulation of the intended experience, not a recording of a real trial.
9. But the shape of it matters. One goal. Relevant help. And a result verified by the person, not the machine.
10. From there, the same pattern could continue. Find the cup. Find the milk. While hot water and appliances remain his own steps.

### Chapter 4 — Three stages of PathSense

1. The phone is where we start, because he already owns one.
2. But holding a phone while making breakfast is not always practical. So the roadmap has three stages, built on one system.
3. Stage one. The mobile camera. Our first prototype.
4. Stage two. A single room camera he can ask to look at an authorised area. Check the bench for my keys. Without picking anything up.
5. Stage three. Connected cameras across the home, able to say whether an item is visible now, or where it was last seen.
6. Each stage is only built if the previous one proves useful.
7. And every camera is on because he asked, visible when active, and his to switch off.

### Chapter 5 — Personalised assistance

1. No two people want the same help.
2. Someone who ran a café for years may want short, direct answers. Someone newer to the kitchen may want every step.
3. So PathSense would be shaped by explicit preferences. Language. Speaking pace. How much detail. The places things usually live. What is remembered, and what is forgotten.
4. Nothing is inferred from a camera about a person's mood, ability or health.
5. The system should adapt to the person, not the other way around.

### Chapter 6 — How we prove it truly helps

1. How will we know if it works? Not by how impressive the technology looks.
2. We would begin by understanding how a person does each task today. Choose one real problem. Build a limited prototype. Test it with people who want to take part. Measure what changed. Then improve, or stop.
3. The measures are plain. Was the right item found? Was the task completed? How much help was needed? Was it easier than the current method? Were there safety or accuracy failures? Would they use it again?
4. We have no results yet, and we will not invent any.
5. That is the point of asking you to help us test it properly.

### Chapter 7 — One home, many futures

1. Back in the kitchen, the outcome we are aiming for is small and real. The coffee found. The cup filled. The morning started on his own terms.
2. If that works for one person, the same approach could support many others. Finding belongings. Identifying ingredients. Reading documents. Managing household routines. Each in the way that suits them.
3. We are asking your organisation to help us co-design, evaluate and responsibly develop PathSense. Lived experience input. Accessibility and rehabilitation expertise. Feasibility testing. And support in finding funding partners.
4. Start with one real problem. Build a platform that can support many.
5. PathSense Home. Independence, one meaningful task at a time.
