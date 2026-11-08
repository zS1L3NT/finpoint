> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Brief for every ticket agent (insight-drilldown)

Checkout: /home/ai/.t3/worktrees/finpoint/t3-69efe8e6, branch `ai/insight-drilldown` (already checked out; never switch).

1. Read: your ticket in `issues/`, `spec.md` (sections the ticket names + §12 done-definition + §13 decisions + §16), AGENTS.md, STYLE.md, COMMIT.md, CONTEXT.md, docs/agents/domain.md. This Next.js differs from your training: read node_modules/next/dist/docs/ before routing/navigation code.
2. Set the ticket `Status: claimed`. Work TDD: domain tests (`bun test`, tests/domain/) for logic first.
3. Layer rules: domain reads in src/logic/*, UI never imports @/data/*. Motion only from src/lib/motion.ts presets.
4. Document every new feature (user's rule): new terms → CONTEXT.md; hard choices → docs/adr/NNNN-*.md; user-visible behaviour → README/in-app copy.
5. Verify: `bun test`; `bun lint` then `bun lint:check`; `bun types:check`; browser tests for what you touched (`bun run test:e2e -- <files> --project=desktop --project=mobile`; animations `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- <files> --workers=1`). New browser test file → exactly one CI group in .github/workflows/ci.yml. Unexpected failure: fix code not tests; before calling flaky, repeat on branch and on `main` and report counts. Name every edited test and why.
6. Screenshots (user reviews in the morning): `bun run build`, `./node_modules/.bin/next start -p 5180`, `npx -y agent-browser@0.27.0 --session t<NN>`, click "Try demo data", switch theme to DARK MODE, capture what your ticket changed at desktop 1440 and mobile 390 into `.scratch/insight-drilldown/review/<NN>-<what>.png`. Kill the server by PID (never `pkill -f`). Machine is RAM-limited: don't leave servers running.
7. `graphify update .` after final edits; include graphify-out/{graph.json,GRAPH_REPORT.md,manifest.json,.graphify_labels.json}.
8. Git: signed `git commit -S`, message `<gitmoji>🤖 lowercase message [skip ci]`; stage only your files (never next-env.d.ts, never `git add -A`/`.`); `git push origin ai/insight-drilldown`. NEVER open a PR, merge, rebase or force-push.
9. Finish: under the ticket's `## Comments` record evidence (commands+results, SHA, edited tests, screenshot paths, and one line "Look for:" telling the user what to judge visually). Tick boxes; `Status: resolved` only if everything passes, else leave claimed and say what's open.
10. Final report ≤10 lines: SHA, pass/fail, edited tests, open issues.
