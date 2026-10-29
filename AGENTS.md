# SpecForge: rules for your AI assistant

Read this file first in every session. Follow it for every change.

## What we are building
A web app that reads a messy university course spec (and an optional blueprint), then produces a corrected spec with a CO-PO-PSO map, flagged defects, an Author, Reviewer, HOD workflow, and HTML export. It also exports `outputs/specforge_output.json` for scoring. The exact file format is `config/specforge_output.schema.json`.

## Stack (do not change)
TypeScript everywhere. Frontend: React 18 + Vite in `src/`. Backend: Node 20 + Express in `server/`, all routes under `/api/v1`. Validate all data with Zod.
Every API reply is `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message": "...", "code": "MACHINE_CODE" } }` with correct HTTP status (400 bad input, 403 not permitted, 404 not found, 500 server error).
No database. Keep data in memory or a JSON file. Role switcher (Author, Reviewer, HOD) instead of login; check permissions on the server for every action.

## How the app is scored (do not break this)
The organisers run this repo at the last commit before 15:45: `npm install`, `npm start` (API on port 3001), then
`POST /api/v1/generate` with multipart fields `spec` (required) and `blueprint` (optional) and the AI key in the x-llm-* headers.
It must return `{ "success": true, "data": { "output": <specforge_output object>, "html": "<the filled spec document>" } }`
with no clicks and no manual steps. `npm run verify` does exactly this against your running app. Keep it passing.

## AI calls
Providers: gemini, openrouter, anthropic. Only `server/llm.ts` may call an AI provider, through `generateJson(prompt, zodSchema, config)`. The user's key comes from the browser in headers `x-llm-provider`, `x-llm-key`, `x-llm-model`. Never store, log, return or commit a key. Never put a key in source code.

## Hard rules
1. Never hard-code course content (course code, title, CO text, mappings, defects). The app must work on a course it has never seen. A hidden check scans the repo for this.
2. Reference data in `config/po_pso.json` (POs, PSOs, Bloom's levels) is configuration, not course content. Use it.
3. HTML export must use the two files in `templates/` as the layout.
4. Keep code simple and readable. No unused dependencies.

## How to work
1. Before coding a level, write a short plan: files you will touch, and a list of checks that prove it works. Show it, then build.
2. Make the smallest change that meets the checks. After each step run `npm run typecheck`.
3. After building, audit your own work against the level's checks. List anything that is missing before saying you are done.
4. Before exporting or submitting, run `npm run check`. Fix every line it prints.
5. Commit after every working level with a clear message.

## Commands
`npm install`, `npm run dev` (web on 5173, API on 3001), `npm start` (API only, what the scorer runs), `npm run typecheck`, `npm run check`, `npm run verify` (the scorer's call against your running app).

## Folders
`sample-inputs/` practice files. `templates/` HTML layouts for export. `config/` reference data and the output schema. `outputs/` your exported JSON (not committed).
