# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interactive D&D character sheet: a static HTML/CSS/vanilla-JS frontend (in `Frontend/`) that POSTs character data to a small local Flask API (in `api/`), which persists it to a JSON file. No build step, no bundler, no package.json — the frontend is opened/served as plain files.

## Running it

Frontend: open `Frontend/Sheet.html` directly in a browser, or serve `Frontend/` statically. It hardcodes API calls to `http://127.0.0.1:5000`, so the backend must be running on that host/port for save to work. (`Frontend/Home.html`, `Scripts/Home.js` and `Stylesheets/Home.css` are empty placeholders for a future home page.)

Backend — install dependencies from the repo root (`requirements.txt` lives there), then run Flask from inside `api/`:
```
python3 -m pip install -r requirements.txt
cd api
python3 -m flask --app main --debug run
```
This runs on `127.0.0.1:5000` with CORS enabled (`flask-cors`) so the page (opened via `file://` or a different port) can call it. `main.py` resolves `api/stats.json` via the module-level `STATS_FILE` (absolute, based on `__file__`), read at request time so tests can `monkeypatch.setattr(main, "STATS_FILE", tmp_path / "stats.json")` instead of touching the real file.

## Checks and tests

There's no linter or build step. CI (`.github/workflows/ci.yml`, on push/PR to `main`) runs the same checks you can run locally:
```
python3 -m py_compile api/main.py
node --check Frontend/Scripts/Sheet.js
python3 -m pytest Tests -v              # only if Tests/test_*.py exist
node --test Tests/*.test.mjs            # only if Tests/*.test.mjs exist
```
Single test: `python3 -m pytest Tests/test_x.py::test_name` or `node --test --test-name-pattern="name" Tests/x.test.mjs`. CI only picks up tests matching those naming patterns. `pytest` isn't in `requirements.txt` — install it separately (it's in the project `.venv`). `Tests/conftest.py` puts `api/` on `sys.path`. `Sheet.js` is a plain browser script (no exports, touches the DOM at top level), so JS tests load it via `Tests/helpers/loadSheet.mjs` (runs it in `node:vm` with a stub `document`/`fetch` and returns `modCalc`, `getProfBonus`, `Character`, `newCac`, etc.); new top-level `const`/`let`/`class` names must be added to its `LEXICAL_EXPORTS` to be reachable. See `Tests/README.md`.

## Planning and working rules

`Documentation/Planning/` holds `Backlog.md`, `Sprint-Plan.md` and `Retrospective.md`; the README's to-do list mirrors the sprint plan. Ground rules from the sprint plan that apply to Claude/agents:
- Every 🔴 Must task (B1, B2, P1, P2, P3, R1) is implemented by the human developer — agents may write tests for or review them, but don't implement them.
- Agents don't commit; leave changes in the working tree for the developer to try and commit.
- Only one party edits `Sheet.js` at a time — agent edits to it happen only in each sprint's "agent window".

Project subagents live in `.claude/agents/` (`game-app-dev`, `test-writer`, `code-reviewer`, `project-manager`).

## Architecture

**Frontend (`Frontend/Sheet.html` + `Scripts/Sheet.js` + `Stylesheets/Sheet.css`)** — single page, no framework, all logic in `Sheet.js`:
- `Character` class is the in-memory model (name, class, race, level, six ability scores, HP via `hpRolls`/`maxHP`/`currentHP`). A single global `newCac` instance holds all sheet state; there's no multi-character support client-side.
- Form fields are read by DOM `id` inside click handlers on the `#submit` button — no form abstraction, so adding a field means an HTML input with a matching id *and* a `getElementById` read in a submit handler. Some ids have spaces or misspellings that must be matched exactly: `CAC Name`, `CAC Class`, `consitusion`, `intelegence`.
- The last submit handler is the "recompute everything" step: it sets ability scores, updates modifier displays, then calls `updateACDisplay()`, `updateProfBonusDisplay()`, `newCac.calculateMaxHP()`, `updateLifeDisplay()` and `renderAttacks()`. New derived stats should hook in there.
- `modCalc(score)` returns the D&D modifier as a **signed string** (`"+2"`, `"-1"`, `"0"`, or `"Invalid"`), not a number. It's written directly into the ability displays and the skill-table cells (tagged by class — `strSkill`, `dexSkill`, `conSkill`, `intSkill`, `wisSkill`, `charSkill` — since each ability backs multiple skills). Callers doing math wrap it in `Number(...)`.
- Derived stats: AC is `10 + Dex mod` (armor items don't affect it yet); proficiency bonus comes from `getProfBonus(level)`.
- HP: `calculateMaxHP()` gives level 1 the full hit die + Con mod, then *rolls* the class hit die (`getHitDie()`) for each further level, caching per-level results in `hpRolls` so they're not re-rolled. Consequence: changing Con after rolls doesn't retroactively change cached levels. Each call also resets `currentHP` to `maxHP`. `increaseLife()`/`decreaseLife()` adjust `currentHP` and call `updateLifeDisplay()`.
- Tabs (`Actions` / `Skills` / `Inventory`) are show/hide via `openTab()` toggling `.tabcontent`/`.tablinks` — not routing.
- Inventory: `inventory` array is separate client-only state, not part of `Character` and **not sent to the backend**. Items are added from the hardcoded `ITEM_CATALOG` via the catalog modal (`openCatalogModal`/`renderCatalog`/`addCatalogItem`), shown by `renderInventory()` and filtered by the `#filter` select. Items of type `"Weapons"` (with `damage`, `damageType`, `ability: "str"|"dex"`, optional `proficient`) also drive the Actions tab via `renderAttacks()`. Inventory handlers are wired with inline `onclick`/`onchange` attributes in generated HTML, using indexes into `inventory`. `#itemSearch` exists in the HTML but isn't wired up.
- Persistence: `Savestats()` (the `#save` button) serializes `newCac` and `POST`s it to `/save`; `getmain()` does a `GET /` on load purely as a reachability check.

**Backend (`api/main.py`)** — single-file Flask app:
- `POST /save` rejects a non-object body or a missing/blank `CACName` with 400 `{"error": ...}`; otherwise it upserts the posted character into `stats.json` (a JSON array of `Character` objects), matched/replaced by `CACName`. There's no character id — renaming a character creates a new entry rather than updating the old one.
- No endpoint to read characters back; `stats.json` is written but never loaded by the frontend.

## Known rough edges worth knowing before changing things

- `openTab()` is defined twice in `Sheet.js` (the later definition wins); consolidate rather than adding a third copy.
- The `#submit` button has several separate click listeners (one per field, and the `CAC Class` one is duplicated). All of them run, in registration order; prefer consolidating into one handler when touching this.
- Form values are stored on `Character` as raw strings (e.g. `Level: "4"`, `Str: "16"` in `stats.json`); math sites coerce with `Number(...)`.
