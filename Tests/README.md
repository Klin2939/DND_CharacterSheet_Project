# Tests

Two suites, no build step and no package.json.

## Setup

```
python3 -m pip install -r requirements.txt
python3 -m pip install pytest
```

(Run from the repo root. Use your virtualenv's `python` if you have one, e.g. `.venv/bin/python`.)
Node 22+ is needed for the JavaScript tests; it has no npm dependencies.

## Run

From the repo root:

```
python3 -m pytest Tests
node --test Tests/
```

CI (`.github/workflows/ci.yml`) runs `python -m pytest Tests -v` and `node --test Tests/*.test.mjs`.

## Layout

- `conftest.py` puts `api/` on `sys.path`, so tests can `from main import app` and use `app.test_client()`.
- `test_*.py` are the backend (Flask) tests. Any test that hits `/save` must redirect the stats file into `tmp_path` and never touch the real `api/stats.json`.
  - `test_api_save.py` covers `GET /` and `POST /save` (create, upsert by `CACName`, corrupt/non-list `stats.json` reset, 400s for bad bodies/names). It points `main.STATS_FILE` at `tmp_path` via `monkeypatch`, and an autouse fixture fails any test that changes the real `api/stats.json` (sha256 before/after).
- `*.test.mjs` are the frontend tests, using Node's built-in `node:test`.
- `helpers/loadSheet.mjs` loads `Frontend/Scripts/Sheet.js` into a fresh `node:vm` context with a stub `document` and `fetch` (no browser, no jsdom). It does not modify `Sheet.js`.

```js
import { loadSheet } from "./helpers/loadSheet.mjs";

const { modCalc, getProfBonus, getHitDie, Character, newCac, document } =
  loadSheet({ random: () => 0.5 });   // optional: stub Math.random inside the sheet
```

`document.elements` maps ids to the fake elements Sheet.js looked up (set `.value`, fire
`.dispatch("click")`), and `fetchCalls` records every `fetch`. If a top-level `class`/`const`/`let`
in `Sheet.js` is renamed, update `LEXICAL_EXPORTS` in `loadSheet.mjs`.
