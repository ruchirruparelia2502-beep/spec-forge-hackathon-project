# SpecForge starter

Participant portal (sign in, prompts, submit): **https://specforge-arena.vercel.app**

Level 0 is already built: a React app and an Express server that run together, plus a Settings panel where you paste your own AI key.

## Start (5 minutes)

```bash
npm install
npm run dev
```

Open http://localhost:5173. Press **Settings**, choose Gemini or OpenRouter, paste your key, press **Test key**. If it says the key works, you are ready for Level 1.

Don't have a key yet? Ask at the help desk. It is free.

## Where things are

| Folder | What it is |
| --- | --- |
| `kit/` | Handbook, one-page guidelines, primer cards and the prompt pack (`specforge-prompt.json`, every level prompt). |
| `sample-inputs/` | A sample course spec, a blueprint and the PO/PSO reference. Practice here. |
| `templates/` | The two HTML layouts your export must use. |
| `config/` | `po_pso.json` (POs, PSOs, Bloom's levels) and `specforge_output.schema.json` (the format of your output file). |
| `src/`, `server/` | Your app. |
| `outputs/` | Where your exported `specforge_output.json` goes. |

## Working with your AI assistant

This repo has an `AGENTS.md` (also copied as `CLAUDE.md`, `GEMINI.md` and a Cursor rule). Your assistant reads it first. Paste each level's prompt from the handbook, in order.

## Before you submit

With the app running (`npm run dev`), in a second terminal:

```bash
npm run verify -- gemini YOUR_KEY
```

This sends the sample files to your app's `POST /api/v1/generate`, exactly as the organisers will, saves
`outputs/specforge_output.json` and `outputs/spec.html`, and checks the output file. Upload both files on the portal,
or zip the whole project (with `outputs/` inside) and upload just the zip.

Your final score comes from the organisers running your code: your last commit before 15:45, or your latest zip if that is
newer. So `npm install` + `npm start` must work on a fresh copy of your project. Don't commit your key.

## Handing in a zip instead of a repo

No GitHub repo, or it won't push? Upload a `.zip` of your project in **Submit**. If it has `outputs/` inside, the zip alone
is a full submission: both files are read from it.

| Put in the zip | Leave out |
| --- | --- |
| `package.json`, `package-lock.json` | `node_modules/` (the organisers install packages; it makes the zip too big) |
| `server/`, `src/`, `scripts/`, `config/`, `templates/` | `.env` (holds your API key; a zip with one is refused) |
| `index.html`, `tsconfig.json`, `vite.config.ts`, `README.md` | `.git/`, `dist/` |
| `outputs/specforge_output.json`, `outputs/spec.html` (scored) | `kit/`, `sample-inputs/` (optional) |

- **Windows:** open the project folder, select everything except `node_modules` and `.env`, right-click, **Send to**,
  **Compressed (zipped) folder**.
- **Mac:** select the same files in Finder, right-click, **Compress**.
- **Terminal** (Mac, Linux, Git Bash), in the project folder:

```bash
zip -r specforge.zip . -x "node_modules/*" ".git/*" "dist/*" ".env*"
```

Up to 4 MB (this starter zips to about 0.3 MB). Each new zip replaces the last one; zips can be uploaded until 15:45.
