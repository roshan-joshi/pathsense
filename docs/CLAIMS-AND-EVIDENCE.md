# Claims register and asset audit

Every substantive statement in the presentation is classified below. Nothing is rendered as pixels in artwork; all claims are editable text in `src/content/*.ts` / `narration.json`.

## Story status
- The main character is a **fictional former café owner**, labelled as illustrative in every mode. The needs shown (coffee, milk, keys, remote, fridge/pantry/laundry items, letters, routines) are generalised from real accessibility needs so that no real person is identifiable.

## Hypotheses (stated as proposals)
- Goal-centred assistance across an entire task is more useful than object description alone.
- A smartphone is the right first platform.
- A room camera could add hands-free value; multiple cameras could add multi-room information. Both are explicitly "only if the previous stage proves useful".
- Explicit preferences (language, pace, detail, locations, memory, privacy) make assistance fit the person.

## Simulations (labelled on screen)
- Chapter 3's entire coffee-finding flow and the "Try the proposed experience" overlay: ribbon "Simulated interaction — intended experience, not a recorded trial", plus narration line "Everything you have just watched is a simulation…". No AI, camera or model runs anywhere in the presentation.
- Chapter 6's co-design session: ribbon "Conceptual co-design session · illustrative · no sessions have taken place yet".
- Chapter 7's outcome: kicker "Conceptual outcome · not a trial result".

## Future promises (hedged)
- Stage 2 and 3 cameras, object-location memory, approved routines: all "could", "potential", "future", "research".

## Explicitly not claimed (listed in reading mode and the PDF)
Safe movement guarantees; detection of every hazard, person or animal; gas ignition supervision; boiling-liquid guidance; certain identification of chemicals/medicines; replacement of O&M training or rehabilitation; 24/7 awareness.

## Numbers
No percentages, scores, market sizes, revenue projections or dollar figures appear anywhere (enforced by a unit test over all content).

## Source conflicts resolved
- Some early requirement notes described alerts for hazards, people and animals. These were **not** carried into the presentation because validated hazard or people detection cannot be implied.
- An earlier outdoor-navigation concept deck was used only for its trust model (confident / likely / uncertain / verify); its navigation scope was not reused.
- No existing prototype was treated as validated capability.

## Asset audit (seven AI-generated reference images → `public/images`)
The seven source images are not included in this repository; `public/images` holds the processed crops.
| Asset | Source | What was removed / covered | Residual |
| --- | --- | --- | --- |
| ch1-kitchen-hero, ch1-kitchen-ambient | image 1, x≥560 | Title, tagline and paragraph inpainted; jar and coffee icons inpainted | Small waveform icon by the phone (reads as a UI glyph) |
| ch1-hand-jar | image 1, top-right | Jar + coffee icons inpainted | none |
| ch2-pouring, ch2-pour-detail | image 2 centre | Headline avoided by crop; tile sliver inpainted | faint glow line on counter |
| tile-keys / fridge / laundry / bin / pantry-hand | image 2 insets | Key, milk, bin icons inpainted; labels cropped out | low source resolution (~270 px); used only as tiles/cards |
| ch3-voice-request | image 3 panel 1 | "1" badge cropped; speech bubble inpainted and covered by HTML bubble | none |
| ch3-complete-cup | image 3 panel 5 | "5" badge cropped | none |
| pantry-feed | image 4 inset | clean | 242 px wide, used inside phone mock-up |
| ch4-mobile / room-camera / home-cameras | image 4 panels | headers and arrows cropped | "Oats" callout excluded by crop; floor-plan graphic in panel 3 is part of the photo |
| ch6-codesign | image 6, x≥720 | headline remnants inpainted | none |
| ch7-owner-cup, ch7-house, ch7-person-a..d | image 7 | label pills and house icons cropped/inpainted | portrait crops are small (190–250 px); shown at ≤300 px |
| Not used | image 5 ("Before/After") | The "Before" half depicts frustration and contradicts the no-pity brief; the "After" half duplicates image 1 | — |
