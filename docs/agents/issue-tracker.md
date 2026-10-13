# Issue tracker: Local Markdown

Specs and tickets live under `.scratch/<feature-slug>/`.
Do not publish them to GitHub Issues.

## Files

- Spec: `spec.md`
- Tickets: `issues/<NN>-<slug>.md`, numbered from `01` in dependency order.
- Each ticket has its own file, acceptance criteria, and a `Blocked by` field.
- Comments append under `## Comments`.

## Status and dependencies

- New approved tickets: `Status: ready-for-agent`
- Before implementation: `Status: claimed`
- After implementation and verification: `Status: resolved`

A ticket can start when all its blockers are resolved.
Record completion evidence in the ticket.

## Skill operations

- Publish a spec or ticket: write its local Markdown file.
- Fetch a spec or ticket: read its file.
- Resolve a ticket: record the outcome and set its status to resolved.
