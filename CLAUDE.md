# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive D&D character sheet: a static HTML/CSS/vanilla-JS frontend that POSTs character data to a small local Flask API, which persists it to a JSON file. No build step, no bundler, no package.json — the frontend is opened/served as plain files.

## Running it

Frontend: open `DnDCACSheet.html` directly in a browser, or serve the directory statically. It hardcodes API calls to `http://127.0.0.1:5000`, so the backend must be running on that host/port for save/load to work.

Backend (from `api/`):
```
python3 -m pip install -r requirements.txt
python3 -m flask --app main --debug run
```
This runs on `127.0.0.1:5000` with CORS enabled (`flask-cors`) so the page (opened via `file://` or a different port) can call it.

There is no test suite, linter, or build/lint/test command configured in this repo.

## Architecture

**Frontend (`DnDCACSheet.html` / `.js` / `.css`)** — single page, no framework:
- `Character` class in `DnDCACSheet.js` is the in-memory model (name, class, race, level, six ability scores, HP tracking via `hpRolls`/`maxHP`/`currentHP`). A single `newCac` instance holds all sheet state; there's no multi-character support client-side.
- Form fields are read by DOM `id` (e.g. `#CAC Name`, `#strength`, `#level`) directly inside click handlers on the `#submit` button — there's no form abstraction, so adding a field means both an HTML input with a matching id and a corresponding `getElementById` read in the submit handler(s).
- `modCalc(score)` computes the standard D&D ability modifier (`floor((score-10)/2)`) and is reused to populate both the six ability-score displays and the skill table cells, which are tagged with classes (`strSkill`, `dexSkill`, `conSkill`, `intSkill`, `wisSkill`, `charSkill`) rather than ids since each ability backs multiple skills.
- HP: `Character.calculateMaxHP()` simulates rolling the class's hit die per level (see `getHitDie()` for the class→die mapping) rather than using the average, so max HP is randomized and stored per-level in `hpRolls` so it doesn't get re-rolled on recalculation. `increaseLife()`/`decreaseLife()` adjust `currentHP` and call `updateLifeDisplay()`.
- Tabs (`Actions` / `Skills` / `Inventory`) are plain show/hide via `openTab()` toggling `.tabcontent`/`.tablinks` — not routing.
- Inventory is a separate, independent piece of client-only state (the `inventory` array), not part of `Character`; it's rendered by `renderInventory()` and filtered by item type via the `#filter` select. It is not sent to the backend.
- `Savestats()` serializes `newCac` (the `Character` instance) and `POST`s it as JSON to `/save`; `getmain()` does a `GET` to `/` on page load as a backend-reachability check.

**Backend (`api/main.py`)** — single-file Flask app:
- `POST /save` upserts the posted character into `api/stats.json` (a JSON array of character objects), matched/replaced by `CACName`. There's no character id — renaming a character's `CACName` field creates a new entry rather than updating the old one.
- No `GET` endpoint to read characters back yet; `stats.json` is written but never read by the frontend.

## Known rough edges worth knowing before changing things

- Duplicate `openTab()` definitions and duplicate submit-button listeners exist in `DnDCACSheet.js` (the later definitions win); consolidate rather than adding a third copy if touching that logic.
- Ability score inputs are read as raw string values from the DOM and passed straight into `Character` fields (e.g. `Level`, `Str`) without numeric coercion at the call site — `modCalc`/`calculateMaxHP` coerce internally where needed via `Number(...)`.
