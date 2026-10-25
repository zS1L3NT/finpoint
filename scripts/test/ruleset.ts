#!/usr/bin/env bun
// test:web:ruleset — makes the default branch require every tier's check run from
// the local-ci app. Run it after adding or removing a tier; --dry-run prints the change.
import { requireChecks } from "./lib/checks"
import { TIER_NAMES } from "./lib/runner"

process.exit(requireChecks(TIER_NAMES, process.argv.includes("--dry-run")))
