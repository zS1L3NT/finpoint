#!/usr/bin/env bun
// test:web:extra — the extra (animation) tier on every project, one test at a time,
// signed as signoff/extra.
import { run } from "./lib/runner"

process.exit(await run("extra", ["extra"]))
