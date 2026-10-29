// npm run verify   Does what the scorer does at the end of the day: sends the sample files to YOUR running app
// (POST /api/v1/generate), saves what comes back to outputs/, then checks the output file.
// Start the app first in another terminal (npm run dev or npm start), then:
//   npm run verify -- gemini YOUR_KEY            (or openrouter / anthropic; works on Windows, Mac and Linux)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

const base = process.env.API_URL ?? "http://localhost:3001/api/v1";
const provider = process.argv[2] ?? process.env.LLM_PROVIDER ?? "gemini";
const key = process.argv[3] ?? process.env.LLM_KEY ?? "";
if (!key) { console.error("Usage: npm run verify -- gemini YOUR_KEY   (or openrouter / anthropic)"); process.exit(1); }

const form = new FormData();
form.append("spec", new Blob([readFileSync("sample-inputs/sample_course_spec.docx")]), "sample_course_spec.docx");
form.append("blueprint", new Blob([readFileSync("sample-inputs/sample_blueprint.doc")]), "sample_blueprint.doc");

const t0 = Date.now();
const res = await fetch(`${base}/generate`, { method: "POST", body: form, headers: { "x-llm-provider": provider, "x-llm-key": key, "x-llm-model": process.argv[4] ?? process.env.LLM_MODEL ?? "" } })
  .catch(() => { console.error(`Could not reach ${base}. Is the app running?`); process.exit(1); });
const j: any = await res.json().catch(() => null);
console.log(`POST /generate answered HTTP ${res.status} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
if (!j?.success) { console.error("The app returned an error:", j?.error?.message ?? "not JSON"); process.exit(1); }
const out = j.data?.output, html = j.data?.html;
if (!out || typeof out !== "object") { console.error("data.output is missing. Return { output, html } in data."); process.exit(1); }
if (!existsSync("outputs")) mkdirSync("outputs");
writeFileSync("outputs/specforge_output.json", JSON.stringify(out, null, 2));
console.log("Saved outputs/specforge_output.json");
if (typeof html === "string" && html.trim()) { writeFileSync("outputs/spec.html", html); console.log("Saved outputs/spec.html"); }
else console.warn("No data.html in the reply. The spec document is worth 20 points.");
execSync("npx tsx scripts/check-output.ts outputs/specforge_output.json", { stdio: "inherit" });
