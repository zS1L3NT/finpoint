# Implemented beginner guide — handoff

Implemented 7 October 2026. Preserve the editable `video/` Remotion project, shared composition, narration clips, timeline, and rendered output for the next AI. The shared branch is `codex/finpoint-learning-guide`; presentation refinements can be committed to that branch.

| Entry | Delivered behavior |
| --- | --- |
| `/help` | Search 17 question-led articles; video and practice entry; separate article progress, sample completion, and real-world checklist. |
| `/help/video` | 17 chapters, approximately 25 minutes; local synthetic narration, illustrated amounts, chapter selection, pause/resume, matching transcript, downloadable transcript/captions. |
| `/help/practice` | Four fictional exercises: lunch, Pending repair, split payment, shared dinner/repayment. Save, pause, resume, or restart without creating financial data. |
| Header and form Help | Contextual article overlay with question selector; closes back to the existing inputs. Forms include Records, pending Statements, Budgets, and Categories. |
| Pending/empty states | Explain the saved Record difference or missing Allocations; next actions for no imports, available amounts, a clear queue, and filtered-out Records. |
| Fresh Dashboard | Optional welcome invitation after seeding. Existing or previously used workspaces do not restart onboarding. |

Each topic teaches problem → explanation → example → steps → result check → specific fix. Coverage includes imports, Accounts, Statements, Records, Allocations, Pending, split purchases, repayments, refunds, treatments, Categories, buckets, monthly targets, Budgets, filters/editing, Dashboard, Monthly Records, backups, Drive sync, and the returning-user routine.

## Editable structure

- Teaching source: `src/lib/guide-content.ts`.
- Article/help presentation: `src/components/help/guide-article.tsx`, `context-help.tsx`.
- Practice flow: `app/help/practice/page.tsx`; pure arithmetic and validation: `src/logic/practice.ts`.
- Learning state: `src/logic/learning.ts` → `src/data/learning.ts`.
- Scenes and motion: `src/components/help/guide-film.tsx`.
- Player/chapter navigation: `src/components/help/guide-video-player.tsx`, `app/help/video/page.tsx`.
- Narration/export commands: `video/README.md`, `video/scripts/narrate.ts`.
- Rendered film: `video/out/finpoint-beginner-guide.mp4`. Output is ignored by Git; do not discard it when handing off.

Restyle layout and animations without changing the financial meaning. Regenerate audio/timeline/transcript/captions together when copy changes. The video is explicitly labeled as illustrated teaching, not a recording of the user's workspace. Separate video lesson cuts remain future derivatives; four interactive sample lessons are delivered.

## Storage and workflow

Database version 3 adds a local `learning` table while preserving earlier migrations. Practice cannot create financial Accounts, Statements, Records, Allocations, or Budgets. Learning is excluded from financial backups/restores and Drive sync. Resetting a lesson touches only its progress.

Existing data is context, not automatic checklist completion. Useful successful imports and saved real Records record checklist events; Record completion uses the app's shared Pending rule, including current Allocations, allocated Pending Statements, and deletion. Matching amounts do not complete a Record while it uses a Pending Statement. Monthly review and locating a backup are explicit user confirmations. Requesting a download alone does not confirm a usable backup.

Help retains unfinished form inputs and restores focus. Practice launched from video returns to that chapter, including after moving to the next lesson. Return destinations are restricted to app learning pages and Dashboard.

## Verification and review

Separate GPT-6 Astra code and design reviews, plus targeted closure reviews, found no remaining material issues in their reviewed scope after fixes.

45 isolated checks used an in-memory IndexedDB, covering sample arithmetic/invalid amounts, Pending repair, split capacity, local persistence/reset, concurrent progress updates, v2-to-v3 data preservation, export/sync exclusion, stale milestones, zero-amount Record rules, safe practice return paths, and a Pending Statement becoming confirmed. No test framework or dependency was added to the app.

Browser verification covered desktop and 390-pixel phone layouts, search, saved sample results, split progression and over-allocation feedback, video playback/chapter seeking/pause/resume, return navigation, and help over an unsaved Record form. After integration with the latest app, the Title draft still remained intact and focus returned to Help; opening the full guide correctly closed the overlay. Financial Statement and Record counts stayed unchanged after practice. Sampled video diagrams were visually checked.

App lint, app TypeScript, video lint/TypeScript, and the production build passed after integrating the latest main branch. The build requires `NODE_ENV=production` in this shell. The revised MP4 at `video/out/finpoint-beginner-guide.mp4` includes the current Pending rule and Sync labels: 25 minutes 7.7 seconds, 720 × 720 at 30 fps, H.264 with AAC audio, 74,537,179 bytes. FFprobe confirmed the format and a full FFmpeg decode completed without errors. The earlier MP4 is preserved at `video/out/finpoint-beginner-guide-prerebase.mp4`. Outputs are local and ignored by Git; the branch includes the editable project, all narration, and instructions to reproduce them. The in-app narrated player is verified. Existing live bank imports and Drive conflict workflows were not re-tested end-to-end.
