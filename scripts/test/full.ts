#!/usr/bin/env bun
// test:web:full — core on every project, signed as soon as it finishes, then extra.
import { run } from "./lib/runner"

process.exit(await run("full", ["core", "extra"]))
