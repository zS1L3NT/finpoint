#!/usr/bin/env bun
// test:web:core — the core tier (desktop and mobile), signed as signoff/core.
import { run } from "./lib/runner"

process.exit(await run("core", ["core"]))
