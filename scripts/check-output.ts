// npm run check [path]   Checks your output file the same way the scorer's first gate does.
import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync, existsSync } from "node:fs";

const file = process.argv[2] ?? "outputs/specforge_output.json";
if (!existsSync(file)) { console.error(`No file at ${file}. Run your app and press Export first.`); process.exit(1); }

let data: any;
try { data = JSON.parse(readFileSync(file, "utf8")); } catch (e) { console.error("Not valid JSON:", (e as Error).message); process.exit(1); }

const schema = JSON.parse(readFileSync("config/specforge_output.schema.json", "utf8"));
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
const problems: string[] = [];
if (!validate(data)) for (const e of (validate.errors ?? []).slice(0, 20)) problems.push(`${e.instancePath || "(root)"} ${e.message}`);
if (data?.input_id !== "SAMPLE") problems.push(`input_id must be exactly "SAMPLE" (found ${JSON.stringify(data?.input_id)}). Anything else scores 0.`);

if (problems.length) { console.error("Not ready to submit:\n- " + problems.join("\n- ")); process.exit(1); }
console.log("Looks good. Upload this file on the submit page.");
