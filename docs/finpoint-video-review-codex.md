# Finpoint video review — Codex

**Author: Codex, the reviewing AI in this conversation.** This is my review and handoff, not a report from the AI that designed or implemented the video.

**Temporary document:** Remove this file once its recommendations have been implemented or explicitly considered and resolved. Carry any lasting decisions into the normal project documentation before removing it. Do not leave this review as a permanent checklist after the work is finished.

Reviewed on 8 October 2026 against `ai/finpoint-learning-guide` at `704c11f5`. The composition is `FinpointGuide`: 16 chapters, 1920 × 1080, 30 fps, approximately 11:45. Timestamps below refer to that version and will move when the timing changes.

## Review scope

I played the complete Studio timeline at normal speed, pausing between review batches, then revisited transitions and final states at specific frames. I also checked the narration text, scene registry, camera/transition code and capture script where a visual needed explanation. This covers animation, alignment, visual readability and beginner comprehension. It is not a review of vocal performance or a newly exported MP4.

The preview ran from an isolated copy of the branch. A preview-only font-path adjustment served the same Inter font because the isolated copy shared dependencies through symlinks. That adjustment is not part of the branch or the proposed fixes. This commit adds only this Markdown review; it does not change the video, application or Remotion project.

## Overall assessment

The examples and chapter sequence give the guide a useful teaching structure. Statements, Records and Allocations have distinct visual identities, the shared dinner arithmetic is understandable, and the guide gradually introduces Category defaults, treatment and planning. The principal weaknesses are continuity within a task, the size of the real UI, and missing visible confirmation of several actions.

The user's flicker observation is correct. The app repeatedly fades, shifts or briefly doubles when the instruction changes, even though the viewer is following the same task in the same form. A beginner has to find the relevant control again after each change. Fix this before adding more decorative animation.

## Priority 1: keep the app continuous within each walkthrough

**Examples:** Import at roughly 3:11–3:20; Lunch at 4:05–4:35; Pending Records around 7:00–7:20; bucket target editing around 9:53–10:03. At the Import boundary near 3:15, the same sidebar and Importer panel blur/reframe as the file state changes. The bucket form also briefly appears doubled between instructions.

The shared header is reasonably stable, but the app footage is inside a fresh `DemoLayer` for each beat. `guide-film.tsx` applies `useLayer` to the entire layer and overlaps beats by 12 frames. In `film/demo.tsx`, a new demo also starts with its own camera plan. This produces a whole-screen transition where the viewer only needs a new instruction or highlight. Some beat boundaries also jump from unfinished footage to the next held marker.

Recommended structure:

1. Keep one app frame and continuous footage/camera state mounted for the whole task.
2. Change the caption and step indicator independently of that frame.
3. Move the highlight to the next control without fading or scaling the app.
4. Pan or zoom only when the next control genuinely needs a closer view. Preserve the previous camera position as the start of that movement.
5. Show Save and its result in the same continuous view. Hold the result before introducing the next concept.

The same principle applies to diagrams: keep the existing Statement/Record relationship on screen when the next sentence refers to it; add a connection, amount or label rather than rebuilding the diagram. Topic changes can still use a chapter transition. The aim is stable context within a task, not one unchanging screen for the entire film.

**Acceptance:** At an instruction boundary, the sidebar, form edges and unchanged fields remain in exactly the same position. There is no second translucent app view, brightness pulse, unexplained zoom reset or cut over an unfinished action.

## Priority 1: make the actual controls readable

**Examples:** Import bank/file controls at 3:11–3:25; Lunch form at 4:08–4:28; both amounts in the split example at 4:44–4:54; Attach to Record at 7:02–7:20; Category defaults at 8:45–8:51; Budget creation at 10:15–10:27.

The full app is often shown with its sidebar and substantial unused space while the relevant form occupies a small portion of the image. At the approximately 794-pixel-wide preview, many field labels are already difficult to read. A narrower embedded player will make this worse. A bright border around a tiny form does not make its contents readable.

Establish the page once, then use a stable close view of the relevant form or rows. For the split task, both the Record amount and Allocation amount must be readable together. For Category defaults, frame the two defaults and their values. Use a small context label when the sidebar is cropped away.

Avoid highlighting an entire panel when the explanation names one amount, badge or control. On the Dashboard, keep the metric label and value together; the current metrics close view cuts into the rightmost card. The spending breakdown needs visible Category labels alongside the colours, rather than a highlighted chart container with the useful labels outside the view.

**Acceptance:** Review the embedded player at its ordinary desktop and phone sizes. A new user can read every field they are told to change without pausing or enlarging the video. Every camera move preserves the target's full label, value and surrounding context.

## Priority 1: show completed actions before claiming success

| Task and time | Current evidence | Required visible result |
| --- | --- | --- |
| Second split Record, 5:00–5:17 | The Gift form is filled, then the film switches to a diagram. | Click Save, show zero remaining or the Statement leaving Allocator, then recap the two Records. |
| Combined dinner, 5:34–5:50 | The filled form and signed arithmetic are shown; the final Save instruction uses an illustration. | Show saving the Record and a result containing both Allocations and the −$30 Record. |
| Complete Pending Record, 7:12–7:20 | The editor shows Jo's +$100 attached, while the caption says it is no longer Pending. | Click Save changes, then show the saved Record with the Pending badge gone. |
| Budget creation, 10:15–10:27 | Name and amount are filled; the date control still says Any date. No Budget is created in the take. | Select the demonstrated dates, create the Budget, and show its actual summary or attached Records. |

These are missing demonstrations, not evidence that the product cannot perform the actions. The capture script records saved markers for split and combine, but the corresponding film scenes do not use them for the final result. The Pending completion scene stops at the editor. The Budget capture only points at the date control and Automatic attach; it does not select dates or submit.

The Lunch walkthrough already demonstrates saving and returning to Allocator. Keep that pattern, but make the disappearance/result easier to identify in the long list. The Pending Statement replacement also reaches an empty placeholder list and a success toast, which is useful proof; hold and enlarge that state.

## Priority 1: correct the Pending Statement demonstration

**Time:** 7:47–7:58, especially the end of Step 2.

The caption says, “Explain it like any other Statement. The Record counts straight away,” but the picture stays on the newly created Pending Statement in Allocator. The “Counts now, stays Pending” callout points to the Statement's badge. No Record is created in this segment.

This can teach that a placeholder Statement itself contributes to spending, contradicting the earlier explanation that the Dashboard comes from Records. The capture contains the subsequent Create Record action and an `explained` marker, but `pending-statements.explain` only plays to and holds `allocator`.

Show selecting the placeholder, creating and saving its Record, then show that Record's Pending status and its contribution to the appropriate total. Attach the callout to the Record. Only then introduce replacing the placeholder with the imported Statement.

## Priority 1: use a Pending definition that fits both causes

**Time:** 7:20–7:28.

The sofa diagram shows −$50 paid and a −$150 Pending Statement allocated to a −$200 Record. Those amounts do add up. The caption nevertheless says, “Pending simply means: this explanation doesn't add up yet.”

The canonical domain rule also keeps a Record Pending when any allocated Statement is still a placeholder. Explain both reasons explicitly: the amounts do not match yet, or some bank activity has not been confirmed by an imported Statement. Suggested plain-language summary: “Pending means this Record is still waiting for a complete, confirmed bank explanation.”

Keep the concert example for an amount mismatch and the sofa/placeholder example for an unconfirmed Statement. Show the distinction visually so a balanced Record with a Pending Statement does not look like a contradiction.

## Priority 2: repair animation order and allow time to read the result

- **Opening recap, approximately 0:51–1:05:** “Explain it” appears before “Bring bank activity,” leaving the middle card alone for several seconds. `StartHelps` requests a second occurrence of `explain`, although that beat has only one, so it uses an early fallback. Reveal the three cards in the stated order.
- **Model, approximately 1:44–1:56:** The split relationship is rebuilt across adjacent beats and the remaining amount restarts. Preserve the already explained relationship and add the “one Statement, several Records” label.
- **Simple model, approximately 2:11–2:19:** The complete Lunch relationship arrives late. Introduce the Statement when the payment is named, connect the Record when the explanation is named, and leave the completed relationship visible.
- **Split recap, approximately 5:09–5:17:** The Gift connection and zero remaining state do appear, but the fully settled diagram has less than a second before the chapter changes. Allow roughly two seconds to read the complete result.
- **Treatment introduction, approximately 8:56–9:01:** Transfer/neutral appears before the Income/Spending/Saving lanes, although it is discussed last. The beat says “not at all” rather than “Transfer,” so the scene uses an early fallback. Use a cue matching the actual text or explicit semantic timing.
- **Bucket introduction, approximately 9:29–9:38:** Much of the explanation has an empty illustration area before the bucket cards arrive. Show a simple Category-to-bucket grouping while defining the concept.

Review fallback cue positions as teaching decisions. They should not make a later concept appear first. Final-state holds should be deliberate, rather than whatever frames happen to remain after the last narrated keyword.

## Priority 2: keep example values and dates consistent

**Dashboard, approximately 5:52–6:02:** The illustrated spending total is $110 for Groceries $50, Gift $30 and Dinner $30. The real Dashboard shows $122 because it also includes Lunch $12. Both totals are valid for their respective sets, but the film does not explain the change. Add Lunch to the illustration and use the same $122 total, or explicitly identify the different set of Records.

**Budget, approximately 10:07–10:14 and 10:28–10:37:** The calendar label says 28 Oct → 4 Nov, but the highlighted cells run from 31 through 7. `DateRange` defaults to indices 3 through 10 in a strip beginning on 28 October. Make the highlighted cells match the caption and the dates actually selected in the app.

The real bucket target example matches its illustration more convincingly: $127 against a $500 target. Preserve that correspondence and show how the remaining amount or pace should be interpreted.

## Alignment, captions and visual language

The broad layout is sound: chapter titles have clear hierarchy, the illustrated scenes use a consistent left-caption/right-diagram arrangement, money generally stays together, and the blue Statement / green Record / violet Allocation / amber Pending distinction is helpful. I did not find a recurring static collision in the diagrams. Keep those foundations.

The main alignment problem is temporal: forms and diagrams change position or rebuild while the viewer is still reasoning about the same object. Treat the position of an unchanged object as part of the explanation. Use a consistent app rectangle, consistent close-view anchors and stable diagram nodes across adjacent instructions.

The captions often display a whole paragraph with future words very dim. This makes the upcoming instruction hard to scan, especially against the dark background. Prefer one short actionable instruction, with readable supporting text and a restrained emphasis on the current phrase. Avoid having a caption page change, camera movement, step change and new highlighted control all compete at once.

The Google Drive diagram communicates ownership and sync clearly, but “the sign-in broker never sees your financial tables” introduces implementation terminology into beginner guidance. Use “Finpoint's servers do not receive your financial data,” if that is the intended explanation. Also show where to connect Drive and how a user recognizes a successful connection; the current app take displays Drive as unavailable, followed by an illustration of successful sync.

The ending points users toward Help but shows only an icon and a chapter list. A short real view locating the Help entry and opening a relevant guide would make that instruction actionable. An optional “Try explaining a $12 Lunch” handoff to isolated practice would be a stronger next step than ending on the list alone.

## Chapter-by-chapter coverage

| Chapter / time | What works | Main improvement |
| --- | --- | --- |
| 1. Why Finpoint? · 0:00–1:05 | Supermarket and shared dinner examples establish the problem. | Fix recap card order; let the solution settle. |
| 2. Model · 1:05–2:19 | Colours and signed amounts distinguish the three concepts. | Keep relationships mounted between beats; give the simple example a readable ending. |
| 3. Import · 2:19–3:25 | Explains exports, Accounts and Revolut's account choice. | Enlarge controls and play file selection/import continuously through the result. |
| 4. Allocator · 3:25–3:57 | Explains remaining amounts and where to find finished work. | Make the remaining value identifiable before scrolling away. |
| 5. First purchase · 3:57–4:36 | Clear progressive instructions; correctly defers advanced fields. | Stabilize the form and emphasize the saved result. |
| 6. Split · 4:36–5:17 | Explains changing both Record and Allocation amounts. | Show saving the second Record and hold the complete diagram. |
| 7. Combine · 5:17–5:50 | −$90 + $60 = −$30 is an effective explanation. | Show the actual Save and final Record. |
| 8. Dashboard · 5:50–6:26 | Clearly states that Records drive analytics. | Match $110/$122 examples; show readable metric and Category labels. |
| 9. Pending Records · 6:26–7:28 | Concert reimbursement is a concrete reason for Pending. | Show completion after saving; explain both Pending causes. |
| 10. Pending Statements · 7:28–8:17 | Placeholder/replacement concept and replacement confirmation are useful. | Actually create the Record before saying it counts. |
| 11. Categories · 8:17–8:52 | Familiar examples and defaults reduce cognitive load. | Enlarge defaults; show where to rename or add a Category if teaching that action. |
| 12. Treatments · 8:52–9:26 | Concrete examples distinguish spending, refunds, saving and transfers. | Repair lane timing; make clear that a transfer's $0 represents its effect on totals. |
| 13. Buckets · 9:26–10:06 | $127/$500 example and target scope are useful. | Add a visual during the definition; stabilize and enlarge target editing. |
| 14. Budgets · 10:06–10:38 | Custom period and automatic membership are explained. | Correct the calendar, select actual dates, create and show the Budget. |
| 15. Backups · 10:38–11:19 | Distinguishes browser data, backup file and the user's Drive. | Locate the connection/restore controls; simplify technical wording. |
| 16. Routine · 11:19–11:45 | Import → Explain → Pending → Dashboard gives users a repeatable routine. | Show the real Help location and offer a concrete practice action. |

## Suggested implementation order and final verification

First fix app continuity and readable framing. Then restore the missing creation/save/result steps and correct Pending semantics. After that, repair cue order, date/value consistency and final-state holds. Finish with caption contrast and the Help/practice handoff.

Replay every affected walkthrough continuously at normal speed after changes. Inspect its instruction boundaries and final proof separately, then watch the whole guide once more to assess pacing. Confirm both the shared in-app player and Remotion export use the corrected sequence. Check normal desktop and phone-sized playback; a full-resolution still alone does not establish readability. Preserve the editable Remotion project and existing assets needed by the next AI.

Once each recommendation is implemented or explicitly considered and resolved, remove this Codex-authored review file as requested by the user.
