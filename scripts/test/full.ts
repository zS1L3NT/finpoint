#!/usr/bin/env bun
// test:web:full — every tier in order, each reported as soon as it finishes.
import { run, TIER_NAMES } from "./lib/runner"

process.exit(await run("full", TIER_NAMES))
