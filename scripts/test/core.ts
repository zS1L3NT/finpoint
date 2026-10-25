#!/usr/bin/env bun
// test:web:core — the core tier (desktop and mobile), reported as the core check.
import { run } from "./lib/runner"

process.exit(await run("core", ["core"]))
