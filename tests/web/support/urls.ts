// Frozen production bundles serve dedicated ports so a running dev server is
// never reused; dev servers keep the 5173/5174 defaults.
const production = process.env.PLAYWRIGHT_SERVER === "production"

export const APP_URL = production ? "http://localhost:5273" : "http://localhost:5173"
export const HARNESS_URL = production ? "http://127.0.0.1:5274" : "http://127.0.0.1:5174"
