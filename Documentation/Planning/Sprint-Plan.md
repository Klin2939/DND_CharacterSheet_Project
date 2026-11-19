# Sprint Plan

_Created: 2026-11-19 · Covers: 2026-11-23 → 2027-01-03 (3 sprints)_

This plan turns [Backlog.md](Backlog.md) into three dated sprints with an owner for every task.
For what's already built, see [Retrospective.md](Retrospective.md).

**Owners:** **You** (the human developer) · `game-app-dev` · `test-writer` · `code-reviewer` · `project-manager`
**Priority:** 🔴 Must · 🟡 Should · 🟢 Could
**Size:** S = under 1 hour · M = 1–3 hours · L = several sessions. Estimates for **You** include learning, testing and debugging time.

---

## Ground rules

1. **Every 🔴 Must belongs to You.** These are B1, B2, P1, P2, P3 and R1 (checked against the Backlog). Agents may write tests for them and `code-reviewer` reviews them, but agents never implement them.
2. **About 2 Must tasks per sprint**, so the plan fits around limited hours and the holidays.
3. **One person in `Sheet.js` at a time.** Almost everything lives in `Frontend/Scripts/Sheet.js`, so agent edits to that file happen only in an "agent window": either *before* your Must work starts in that sprint, or *after* it's merged. Each sprint below says when that window is.
4. **Review gate:** each of your Must tasks gets a `code-reviewer` pass before you commit it. Every sprint also ends with a `code-reviewer` sweep of all the sprint's changes.
5. **Agents don't commit.** They leave changes in the working tree. You read the summary, try the change in the browser, and commit it yourself with a descriptive message (see the Retrospective's "What to carry forward").

## Calendar at a glance

| Sprint | Dates | Length | Holiday notes | Your Musts | Sprint goal |
|--------|-------|--------|---------------|------------|-------------|
| **1** | Mon 2026-11-23 → Sun 2026-12-06 | 2 weeks | Thanksgiving (Thu 11-26, Fri 11-27): light sprint | B1, B2 | Make everything already on screen work correctly, with a test safety net under the existing math. |
| **2** | Mon 2026-12-07 → Sun 2026-12-20 | 2 weeks | None. This is the full-effort sprint | P1, P2 | Close the save/load loop: a saved character can be loaded back into the sheet. |
| **3** | Mon 2026-12-21 → Sun 2027-01-03 | 2 weeks | Christmas (12-24, 12-25) and New Year's Day (01-01): light sprint, about 1 week of real effort | P3, R1 | Finish the round trip with inventory, and make equipped armor count toward AC. |

## Dependency map

```
C4, C5 (test infra) ──► all test tasks
P8 (absolute stats.json path) ──► P5 ──► API tests (they patch STATS_FILE instead of chdir)
B1, B2 (You) ──► C1+C2 refactor (game-app-dev). Never at the same time: same file and same submit flow
C3 (numbers as numbers) ──► P2 (You). Loading back is simpler when saved values are already numbers
P1 (You) ──► P2 (You) ──► P3 (You)
P1 + P2 ──► U1 Home page (game-app-dev)
R1 (You) ──► armor AC tests (test-writer)
```

---

## Sprint 1: "Finish what's on screen" (2026-11-23 → 2026-12-06)

**Goal:** Make everything already on screen work correctly, with a test safety net under the existing math.

**Sequencing in `Sheet.js`:** You own `Sheet.js` from 11-23 until B1 and B2 are both reviewed and committed. During that time the agents work only in `api/main.py`, `Tests/` and the repo root, which don't collide with you. The `C1`+`C2` refactor (S1-T12) starts **only after** S1-T1 and S1-T2 are committed. If B1/B2 slip past 12-04, S1-T12 moves to the first days of Sprint 2, while you're working in `api/main.py` on P1.

### Your tasks

| Task | Backlog | Size | Files | Owner |
|------|---------|------|-------|-------|
| S1-T1 | B1 🔴 Submit no longer re-heals | S (~1 h) | `Frontend/Scripts/Sheet.js` | **You** |
| S1-T2 | B2 🔴 Skill proficiency checkboxes work | M (2–3 h, includes a 30-minute spike on checkbox `.checked` and `change` events) | `Frontend/Sheet.html`, `Frontend/Scripts/Sheet.js` | **You** |

**S1-T1 · B1: Submit keeps current HP**
- [ ] Given a fresh character, when I press Submit for the first time, then current HP = max HP.
- [ ] Given a character at 5/12 HP, when I press Submit again with no changes, then HP still shows 5/12.
- [ ] Given a character at 5/12 HP, when I raise the level and Submit, then max HP goes up and current HP stays at 5. It is never higher than the new max.
- [ ] Given a character at 12/12 HP, when I lower the level so max becomes 8, then current HP is capped at 8/8.
- Hint: in `calculateMaxHP()`, only set `currentHP = maxHP` when `currentHP` hasn't been set yet. Otherwise use `Math.min(currentHP, maxHP)`.

**S1-T2 · B2: Skill proficiency checkboxes**
- [ ] Given Str 16 (+3) at level 1 (PB +2), when I check Athletics, then Athletics shows `+5`. When I uncheck it, it shows `+3`.
- [ ] Given Athletics is checked, when I change the level to 5 and Submit, then Athletics shows `+6`.
- [ ] Unchecked skills still show the plain ability modifier.
- [ ] The checked skills are stored on `newCac` (for example a `skillProfs` array of skill names), so they're included in Save.
- Recommended: put the math in a small pure function such as `skillModifier(score, proficient, level)`, so `test-writer` can test it without the DOM.

### Agent tasks

| Task | Backlog | Size | Files | Owner | Depends on |
|------|---------|------|-------|-------|------------|
| S1-T3 | Review of B1 | S | `Sheet.js` (read only) | `code-reviewer` | S1-T1 |
| S1-T4 | Review of B2 | S | `Sheet.html`, `Sheet.js` (read only) | `code-reviewer` | S1-T2 |
| S1-T5 | C4 🟡 `.gitignore` | S | `.gitignore` (new), repo root | `game-app-dev` | none (day 1) |
| S1-T6 | C5 🟡 Test infrastructure | M | `Tests/conftest.py`, `Tests/helpers/loadSheet.mjs`, `Tests/README.md` | `test-writer` | none (day 1–2) |
| S1-T7 | P8 🟡 Absolute `stats.json` path | S | `api/main.py` | `game-app-dev` | none |
| S1-T8 | P5 🟡 Validate `/save` | S | `api/main.py` | `game-app-dev` | S1-T7 |
| S1-T9 | Test: API `/save` (C5, P5, P8) | M | `Tests/test_api_save.py` | `test-writer` | S1-T6, S1-T8 |
| S1-T10 | Test: core math (C5) | M | `Tests/sheet_math.test.mjs` | `test-writer` | S1-T6 |
| S1-T11 | Test: B1 and B2 regressions | S | `Tests/sheet_hp.test.mjs`, `Tests/sheet_skills.test.mjs` | `test-writer` | S1-T1, S1-T2 |
| S1-T12 | C1 + C2 🟡 One `openTab()`, one `#submit` handler | M | `Frontend/Scripts/Sheet.js` | `game-app-dev` | S1-T1, S1-T2, S1-T3, S1-T4, S1-T10 |
| S1-T13 | End-of-sprint review | S | everything changed since 11-23 | `code-reviewer` | all of the above |
| S1-T14 | C8 🟢 README "Things completed so far" | S | `README.md` | `project-manager` | none |
| S1-T15 | Sprint 1 retro and plan update | S | `Documentation/Planning/Sprint-Plan.md`, `README.md` to-do list | `project-manager` | S1-T13 |

**Acceptance criteria**
- **S1-T3 / S1-T4:** The review lists 🔴/🟡 findings with `file:line`. You fix every 🔴 before committing.
- **S1-T5:** `.gitignore` covers `.DS_Store`, `__pycache__/`, `*.pyc` and `.pytest_cache/`. The tracked `.DS_Store`, `__pycache__/…` and `api/__pycache__/…` are untracked with `git rm --cached` (the files stay on disk). After running Flask and pytest, `git status` shows no new noise.
- **S1-T6:** `Tests/conftest.py` puts `api/` on `sys.path`. `Tests/helpers/loadSheet.mjs` loads `Sheet.js` in `node:vm` with a stub `document` and `fetch`, and exposes `modCalc`, `getProfBonus`, `Character` and `newCac`. One smoke test each for `python3 -m pytest Tests` and `node --test Tests/`, both green. `Tests/README.md` gives the two commands and `python3 -m pip install pytest`. `Sheet.js` is not edited.
- **S1-T7:** `main.py` defines `STATS_FILE` based on `os.path.dirname(os.path.abspath(__file__))`. Running Flask from the repo root writes to `api/stats.json`. Existing saves still load.
- **S1-T8:** A missing body, a non-object body (`null`, a list) or a missing/empty `CACName` returns **400** with `{"error": "..."}`. A valid save still returns 200 and upserts.
- **S1-T9:** pytest with `app.test_client()` and `monkeypatch.setattr(main, "STATS_FILE", tmp_path / "stats.json")`. Covers: `GET /` message; first save creates the file; same `CACName` replaces; a different name appends; corrupt `stats.json` is reset, not a 500; the three bad-body cases → 400. The real `api/stats.json` is never touched (its checksum is unchanged after the run).
- **S1-T10:** `node --test` covers `modCalc` (1 → `"-5"`, 9 → `"-1"`, 10 → `"0"`, 11 → `"0"`, 20 → `"+5"`, 30 → `"+10"`, `"abc"` → `"Invalid"`, and checks that it returns strings); `getProfBonus` at 1, 4/5, 8/9, 12/13, 16/17 and 20; `getHitDie` for all 12 classes plus the fallback; `calculateMaxHP` with `Math.random` stubbed (level 1 = max die + Con mod, minimum 1 per level, `hpRolls` not re-rolled, string `Level` `"4"` works). All tests pass on the current code. Any real bug found is reported, not patched.
- **S1-T11:** Regression tests for every scenario in the S1-T1 criteria (Submit twice keeps HP, capping when max drops). B2: tests for the pure skill helper if you wrote one. If not, a short manual browser checklist added to `Tests/README.md`.
- **S1-T12:** Exactly one `openTab()` and one `#submit` click listener remain. Behavior is identical: every sheet value after Submit matches before and after (manual check of all three tabs). `node --test Tests/` is still green. `node --check` passes.
- **S1-T13:** `code-reviewer` runs `git diff` since the sprint start plus both test commands, and no 🔴 findings are left open.
- **S1-T14:** The README list matches the Retrospective's "Completed features" and keeps the README's HTML style.
- **S1-T15:** Short retro (done / slipped / why) added to the bottom of this file, done items marked (struck through) in the README to-do list, and any slipped tasks moved into Sprint 2 with a note.

---

## Sprint 2: "Close the save/load loop" (2026-12-07 → 2026-12-20)

**Goal:** Close the save/load loop: a saved character can be loaded back into the sheet.

**Sequencing:**
- **Week 1 (12-07 → 12-11):** you work on **P1 in `api/main.py`**. This is the agent window for `Sheet.js`. `game-app-dev` lands, in this order: (S1-T12 if it slipped) → S2-T5 C3+B5 → S2-T6 B3+B4 → S2-T7 P4, one at a time so they don't conflict with each other. All of it must be committed by **Fri 12-11**.
- **Week 2 (12-14 → 12-18):** you work on **P2 in `Sheet.js`**. Agents stay out of `Sheet.js` and `api/main.py`; they only write tests.

### Your tasks

| Task | Backlog | Size | Files | Owner |
|------|---------|------|-------|-------|
| S2-T1 | P1 🔴 `GET /characters` and `GET /characters/<name>` | M (2–3 h, includes a 30-minute spike: Flask routes with URL variables, `jsonify`, 404) | `api/main.py` | **You** |
| S2-T2 | P2 🔴 Fill the sheet from a loaded character | M–L (3–4 h over 2 sittings, includes a spike: `fetch` GET + `res.json()`) | `Frontend/Sheet.html`, `Frontend/Scripts/Sheet.js` | **You** |

**S2-T1 · P1: Load endpoints**
- [ ] `GET /characters` returns 200 and a JSON list of every saved character. It returns `[]` if `stats.json` is missing, empty or corrupt.
- [ ] `GET /characters/Thorin` returns 200 and that character's object.
- [ ] `GET /characters/Nobody` returns **404** with `{"error": "Character not found"}`.
- [ ] Both routes read from `STATS_FILE` (from P8), not a relative path. Tip: move the "load the file or return `[]`" code from `/save` into one helper function that both routes use.
- [ ] Tried in the browser or with `curl http://127.0.0.1:5000/characters`.

**S2-T2 · P2: Fill the sheet from a saved character**
- [ ] The sheet has a small "Load" control: a `<select>` filled from `GET /characters`, plus a Load button. (The full character picker is U1 on the Home page; keep this one minimal.)
- [ ] Given I saved "Thorin" (Fighter 4, Str 16, HP 30/38, Athletics proficient), when I reload the page and load Thorin, then the name, class, race, level, all six scores, modifiers, skills (including proficiencies from B2), PB, AC and HP **30/38** all match.
- [ ] HP is **not re-rolled**: `hpRolls` is restored, and pressing Submit right after loading keeps max HP at 38.
- [ ] Loading an unknown name or with the API offline shows a visible error. The sheet doesn't half-load.
- Hint: rebuild the object with `Object.assign(new Character(), data)` so methods like `calculateMaxHP()` still exist, then call the same "recompute everything" function the Submit handler uses (after S1-T12 there is exactly one).
- Recommended: put the "data → Character" step in its own function (for example `characterFromData(data)`) so `test-writer` can test it in Sprint 3.

### Agent tasks

| Task | Backlog | Size | Files | Owner | Depends on / window |
|------|---------|------|-------|-------|---------------------|
| S2-T3 | Review of P1 | S | `api/main.py` (read only) | `code-reviewer` | S2-T1 |
| S2-T4 | Review of P2 | S | `Sheet.html`, `Sheet.js` (read only) | `code-reviewer` | S2-T2 |
| S2-T5 | C3 🟡 numbers as numbers + B5 🟡 invalid/empty scores | S–M | `Frontend/Scripts/Sheet.js` | `game-app-dev` | S1-T12 · **by 12-09** |
| S2-T6 | B3 🟡 HP amount input + B4 🟡 inventory search | S–M | `Frontend/Sheet.html`, `Frontend/Scripts/Sheet.js` | `game-app-dev` | S2-T5 · **by 12-10** |
| S2-T7 | P4 🟡 Save feedback in the page | S | `Frontend/Sheet.html`, `Frontend/Scripts/Sheet.js`, `Frontend/Stylesheets/Sheet.css` | `game-app-dev` | S1-T8, S2-T6 · **by 12-11** |
| S2-T8 | Test: GET endpoints (P1) | S | `Tests/test_api_get.py` | `test-writer` | S2-T1 |
| S2-T9 | Test: attack bonus math, C3/B5 coercion, B3 amount | M | `Tests/sheet_attacks.test.mjs`, `Tests/sheet_math.test.mjs` | `test-writer` | S2-T5, S2-T6 |
| S2-T10 | End-of-sprint review | S | everything changed since 12-07 | `code-reviewer` | all of the above |
| S2-T11 | Sprint 2 retro and plan update | S | `Documentation/Planning/Sprint-Plan.md`, `README.md` to-do list | `project-manager` | S2-T10 |

**Acceptance criteria**
- **S2-T3 / S2-T4:** As in Sprint 1. For P2, the reviewer also cross-checks every loaded field id against `Sheet.html`, including the quirky ids `CAC Name`, `CAC Class`, `consitusion` and `intelegence`.
- **S2-T5:** After Submit + Save, `stats.json` shows `"Level": 4` and `"Str": 16` (numbers, not strings). An empty or non-numeric ability box defaults to 10 (or is blocked with a message), and neither `"Invalid"` nor `NaN` appears in the mods, AC or attacks. Older saves with string values still work.
- **S2-T6:** Typing 7 in the HP amount box and pressing − deals 7, and + heals 7. Empty means 1, and HP stays capped between 0 and max. Typing "sw" in `#itemSearch` shows only matching items and combines with the type filter. Remove and quantity still act on the correct item while the list is filtered (`inventory.indexOf(item)`).
- **S2-T7:** A successful save shows "Saved!" in the page. A 400 shows the API's `error` text, and an offline API shows "Can't reach the server". No `console.log`-only feedback is left in `Savestats()`.
- **S2-T8:** pytest covers the list (empty, missing file, corrupt file → `[]`), the single-character case (found, 200), not found (404 JSON), and save → get round trip (the GET returns what was POSTed). It uses a `STATS_FILE` monkeypatch and never touches the real file.
- **S2-T9:** `node --test` covers attack bonus = ability mod + PB when proficient, and ability mod alone when not; Dex weapons use Dex; damage text shows the signed mod. If the math is inline in `renderAttacks()`, assert on the stubbed container's `innerHTML`, or report that a helper extraction is needed. Also covers C3 (the values are `number`s) and B5 (empty → 10, no `NaN`).
- **S2-T10 / S2-T11:** As in Sprint 1.

---

## Sprint 3: "Inventory round trip and armor AC" (2026-12-21 → 2027-01-03, light)

**Goal:** Finish the round trip with inventory, and make equipped armor count toward AC.

**Holiday sizing:** 12-24, 12-25 and 01-01 are off. Your load is one S task and one M task (about 4 hours total).

**Sequencing:**
- **Agent window: Mon 12-21 → Tue 12-22.** `game-app-dev` lands S3-T5 (P9 + C6) and then S3-T6 (U1's small `Sheet.js` hook) before you start on P3. After that, agents stay out of `Sheet.js` for the rest of the sprint.
- **You:** P3 first (inventory has to round-trip before "equipped" armor can be saved), then R1.
- Armor AC tests (S3-T10) need R1 to be committed. If R1 lands late, S3-T10 moves to the first week of Sprint 4. That still follows the "same sprint or the sprint after" rule.

### Your tasks

| Task | Backlog | Size | Files | Owner |
|------|---------|------|-------|-------|
| S3-T1 | P3 🔴 Save inventory with the character | S (1–1.5 h) | `Frontend/Scripts/Sheet.js` | **You** |
| S3-T2 | R1 🔴 Armor affects AC | M (2–3 h) | `Frontend/Scripts/Sheet.js` (catalog, inventory rows, `updateACDisplay`) | **You** |

**S3-T1 · P3: Inventory survives save → load**
- [ ] Given an inventory of Longsword (proficient), Chain Mail and 3 Potions, when I save, reload the page and load the character, then the inventory list, quantities, proficiency checkboxes and Attacks tab all match.
- [ ] A character saved before this change (no inventory in the JSON) loads with an empty inventory instead of an error.
- [ ] `stats.json` shows the items under the character (for example `"inventory": [...]`).

**S3-T2 · R1: Equipped armor sets AC**
- [ ] Armor items in `ITEM_CATALOG` gain `armorType` (`light` / `medium` / `heavy` / `shield`) and `baseAC`: Leather Armor light 11, Chain Shirt medium 13, Chain Mail heavy 16, Shield +2.
- [ ] Each armor row in the inventory has an "Equipped" checkbox, and only one body armor can be equipped at a time.
- [ ] With Dex 18 (+4): nothing equipped → AC 14; Leather → 15; Chain Shirt → 15 (Dex capped at +2); Chain Mail → **16**; Chain Mail + Shield → 18.
- [ ] Unequipping or removing armor drops AC back right away. The equipped state is saved and loaded (builds on P3).
- Recommended: a pure function `calculateAC(dexScore, inventory)` that `updateACDisplay()` calls, so `test-writer` can test it.

### Agent tasks

| Task | Backlog | Size | Files | Owner | Depends on / window |
|------|---------|------|-------|-------|---------------------|
| S3-T3 | Review of P3 | S | `Sheet.js` (read only) | `code-reviewer` | S3-T1 |
| S3-T4 | Review of R1 | S | `Sheet.js` (read only) | `code-reviewer` | S3-T2 |
| S3-T5 | P9 🟢 one `API_BASE` const + C6 🟢 remove debug `console.log` | S | `Frontend/Scripts/Sheet.js` | `game-app-dev` | **12-21 (agent window)** |
| S3-T6 | U1 🟡 Home page character list | M | `Frontend/Home.html`, `Frontend/Scripts/Home.js`, `Frontend/Stylesheets/Home.css`, small hook in `Frontend/Scripts/Sheet.js` | `game-app-dev` | S2-T1, S2-T2, S3-T5 · `Sheet.js` hook **by 12-22** |
| S3-T7 | Test: P2 load restores the sheet | S–M | `Tests/sheet_load.test.mjs` | `test-writer` | S2-T2 |
| S3-T8 | Test: P3 inventory round trip | S | `Tests/test_api_get.py`, `Tests/sheet_load.test.mjs` | `test-writer` | S3-T1 |
| S3-T9 | Test: `/save` keeps nested data (inventory, `hpRolls`) unchanged | S | `Tests/test_api_save.py` | `test-writer` | S3-T1 |
| S3-T10 | Test: armor AC (R1) | S | `Tests/sheet_ac.test.mjs` | `test-writer` | S3-T2 |
| S3-T11 | End-of-sprint review | S | everything changed since 12-21 | `code-reviewer` | all of the above |
| S3-T12 | U4 🟢 Project name | S | `README.md` | `project-manager` | none (you make the final pick) |
| S3-T13 | Sprint 3 retro and Sprint 4 proposal | S | `Documentation/Planning/Sprint-Plan.md`, `README.md` to-do list | `project-manager` | S3-T11 |

**Acceptance criteria**
- **S3-T3 / S3-T4:** As in Sprint 1. For R1, the reviewer also checks the AC math against 5e RAW and the inventory index handling when items are equipped or removed.
- **S3-T5:** `127.0.0.1:5000` appears exactly once in `Sheet.js` (`const API_BASE = ...`). The console is quiet during normal use (load, submit, save, inventory). Behavior is unchanged.
- **S3-T6:** `Home.html` lists every character from `GET /characters` (name, class, level), plus a "New Character" button that opens a blank `Sheet.html`. Clicking a character opens `Sheet.html?name=<CACName>`, which auto-loads it through your P2 load function (the hook only *calls* your function; it doesn't change it). If the API is offline, a visible message appears. Names are inserted with `textContent`, not `innerHTML`.
- **S3-T7:** Given saved JSON with `hpRolls`, `currentHP` and string or number scores, the load function produces a `Character` whose methods work and whose HP isn't re-rolled (`Math.random` is stubbed to throw if it gets called). Requires the helper recommended in S2-T2. If it doesn't exist, the test reports that instead of editing `Sheet.js`.
- **S3-T8 / S3-T9:** A save → GET round trip returns `inventory` (with `proficient` and `equipped` flags) and `hpRolls` exactly as sent. An old-format character without `inventory` still returns 200.
- **S3-T10:** `calculateAC` covers every row in the S3-T2 criteria, plus a low Dex (Dex 8 with Leather → 10, and with Chain Mail → 16, since heavy armor ignores Dex). All tests pass.
- **S3-T12:** `project-manager` proposes 5 names with one-line reasons. **You pick one.** The README's `Name TBD` line is replaced.
- **S3-T13:** Retro added, and a Sprint 4 proposal drafted from the "Later / Icebox" list below.

---

## Later / Icebox

Not scheduled in these three sprints. The Shoulds are the first candidates for Sprint 4 (from 2027-01-04).

| Backlog | Item | Priority | Why it waits |
|---------|------|----------|--------------|
| P6 | Character ids (rename without duplicating) | 🟡 | **Sprint 4 first pick.** It changes the upsert key and the `GET /characters/<name>` route, so it waits until the P1–P3 loop is stable and tested. |
| R2 | Saving throws with class proficiencies | 🟡 | Sprint 4. Reuses the B2 skill-proficiency pattern. |
| R3 | Race bonuses to ability scores and speed | 🟡 | Sprint 4. Pairs with R5 (speed). |
| R6 | Spellcasting (DC, attack, slots) | 🟡 | Size L. Needs its own epic and breakdown, probably Sprint 5. |
| B6 | Cached `hpRolls` vs. level/Con changes | 🟢 | Needs a rule decision first (re-roll or apply Con to every level). Best done after B1. |
| P7 | Delete a character | 🟢 | Fits naturally with the U1 Home page in Sprint 4. |
| R4 | Passive Perception | 🟢 | Small. Good filler once B2 proficiencies exist. |
| R5 | Initiative and Speed boxes | 🟢 | Do it with R3. |
| R7 | Finesse weapons | 🟢 | Touches `renderAttacks()`. Do it after S2-T9 has tested the attack math. |
| R8 | Hit dice and rests | 🟢 | Depends on B6's HP rule. |
| R9 | Temp HP and death saves | 🟢 | After B3 (HP amount input). |
| R10 | Custom items | 🟢 | Watch out for XSS: user text in `innerHTML` templates. |
| R11 | Background, alignment, XP, notes | 🟢 | Easy once P2 loads every field generically. |
| U2 | Live recalculation on input | 🟢 | Much easier after C2 (one handler) and C3. |
| U3 | Sort skills and show the ability | 🟢 | HTML-only polish. |
| C7 | Fix misspelled ids and ids with spaces | 🟢 | Touches every `getElementById` and the P2 load code. Do it in a quiet sprint with the tests green before and after. |

---

## Per-owner summary

| Owner | Sprint 1 (11-23 → 12-06) | Sprint 2 (12-07 → 12-20) | Sprint 3 (12-21 → 01-03) | Total |
|-------|--------------------------|--------------------------|--------------------------|-------|
| **You** | S1-T1 (B1), S1-T2 (B2) | S2-T1 (P1), S2-T2 (P2) | S3-T1 (P3), S3-T2 (R1) | **6** (all the Musts) |
| `game-app-dev` | S1-T5, S1-T7, S1-T8, S1-T12 | S2-T5, S2-T6, S2-T7 | S3-T5, S3-T6 | **9** |
| `test-writer` | S1-T6, S1-T9, S1-T10, S1-T11 | S2-T8, S2-T9 | S3-T7, S3-T8, S3-T9, S3-T10 | **10** |
| `code-reviewer` | S1-T3, S1-T4, S1-T13 | S2-T3, S2-T4, S2-T10 | S3-T3, S3-T4, S3-T11 | **9** |
| `project-manager` | S1-T14, S1-T15 | S2-T11 | S3-T12, S3-T13 | **5** |

Backlog coverage: B1–B5, P1–P5, P8, P9, R1, U1, U4, C1–C6 and C8 are scheduled. Everything else is in the Icebox.

---

## Definition of Done

A task is done when all of these are true:

- [ ] **It works in the browser:** the acceptance criteria were checked by hand in `Frontend/Sheet.html` (with Flask running from `api/` for anything that saves or loads), and nothing else on the page broke.
- [ ] **Tests pass:** `python3 -m pytest Tests` and `node --test Tests/` are green, including the tests written for this task (in the same sprint or the next one).
- [ ] **It's been reviewed:** `code-reviewer` has reviewed the change (before commit for your Must tasks, and in the end-of-sprint sweep for everything else), with no open 🔴 findings.
- [ ] **It's committed** with a descriptive message ("Add armor-based AC", not "Update"), and it is marked done in this plan and in the README to-do list.

---

## Sprint retros

_`project-manager` adds a short retro here at the end of each sprint (S1-T15, S2-T11, S3-T13)._
