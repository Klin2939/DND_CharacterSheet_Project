# Backlog

_Last updated: 2026-11-19_

Everything left to build or fix on the D&D Character Sheet, grouped by area and ranked by priority.
For what's already done, see [Retrospective.md](Retrospective.md).

**Priority:** 🔴 Must · 🟡 Should · 🟢 Could
**Size:** S = under 1 hour · M = 1–3 hours · L = several sessions

---

## 1. Bugs & half-finished features

These are wired into the page but don't fully work yet. They're the cheapest wins.

| # | Item | Priority | Size | Files | Done when |
|---|------|----------|------|-------|-----------|
| B1 | Every **Submit** re-heals the character: `calculateMaxHP()` sets `currentHP = maxHP` each time | 🔴 | S | `Sheet.js` | Submitting again keeps current HP (capped at the new max) |
| B2 | The **Skill proficiency checkboxes** (`.prof-checkbox`) do nothing | 🔴 | M | `Sheet.html`, `Sheet.js` | Checking a skill adds the proficiency bonus to that skill's modifier |
| B3 | The **HP amount input** (`#quantity` in the HP box) isn't hooked up | 🟡 | S | `Sheet.html`, `Sheet.js` | Typing 7 and pressing −/+ deals or heals 7 HP (empty means 1) |
| B4 | The **Inventory search box** (`#itemSearch`) does nothing | 🟡 | S | `Sheet.js` | Typing filters the inventory list by name, together with the type filter |
| B5 | The `"Invalid"` modifier shows when an ability box is left empty or non-numeric, and AC/attacks become `NaN` | 🟡 | S | `Sheet.js` | Empty or invalid scores are blocked or default to 10 |
| B6 | Lowering the level or changing Con after HP was rolled doesn't update cached `hpRolls` | 🟢 | M | `Sheet.js` | Decide on a rule (re-roll, or apply the Con change to every level) and document it |

## 2. Saving & loading characters

| # | Item | Priority | Size | Files | Done when |
|---|------|----------|------|-------|-----------|
| P1 | **Load a character**: add a `GET /characters` and `GET /characters/<name>` endpoint | 🔴 | M | `api/main.py` | The API returns saved characters as JSON |
| P2 | **Fill the sheet from a loaded character** (form fields, mods, HP, AC) | 🔴 | M | `Sheet.js` | Picking a saved character restores the whole sheet without re-rolling HP |
| P3 | **Save inventory** with the character (move `inventory` into `Character` or send it alongside) | 🔴 | S | `Sheet.js` | Inventory survives save → load |
| P4 | Show **save feedback** in the page (success/error message instead of `console.log`) | 🟡 | S | `Sheet.html`, `Sheet.js` | The user sees "Saved!" or a clear error |
| P5 | **Validate `/save`**: reject a missing body or missing `CACName` with a 400 | 🟡 | S | `api/main.py` | A bad request returns 400 JSON, not a 500 |
| P6 | **Character ids** so renaming doesn't create a duplicate | 🟡 | M | `main.py`, `Sheet.js` | Renaming then saving updates the same entry |
| P7 | **Delete a character** endpoint and button | 🟢 | S | `main.py`, `Sheet.js` | A character can be removed from `stats.json` |
| P8 | Use an absolute path for `stats.json` (based on `__file__`) | 🟡 | S | `main.py` | Running Flask from any folder saves to `api/stats.json` |
| P9 | Put the API URL in one `API_BASE` constant | 🟢 | S | `Sheet.js` | `127.0.0.1:5000` appears once |

## 3. D&D rules & sheet features

| # | Item | Priority | Size | Files | Done when |
|---|------|----------|------|-------|-----------|
| R1 | **Armor affects AC** (light: + Dex; medium: + Dex max 2; heavy: no Dex; shield +2) via an "equipped" toggle | 🔴 | M | `Sheet.js` | Equipping Chain Mail sets AC to 16 regardless of Dex |
| R2 | **Saving throws** section with class proficiencies | 🟡 | M | `Sheet.html`, `Sheet.js` | Six saves shown, with PB added for the class's two proficient saves |
| R3 | **Race bonuses** to ability scores (and speed) | 🟡 | M | `Sheet.js` | Picking Dwarf adds +2 Con, and so on |
| R4 | **Passive Perception** display (10 + Perception) | 🟢 | S | `Sheet.html`, `Sheet.js` | Shown in the side panel |
| R5 | **Initiative** and **Speed** boxes | 🟢 | S | `Sheet.html`, `Sheet.js` | Initiative = Dex mod; speed comes from race |
| R6 | **Spellcasting**: save DC, spell attack, spell slots by class and level | 🟡 | L | all frontend | A Wizard 3 shows DC/attack and 4/2 slots that can be spent |
| R7 | **Finesse weapons** use the higher of Str or Dex | 🟢 | S | `Sheet.js` | A Rapier uses Str if it's higher |
| R8 | **Hit dice & rests**: short rest spends hit dice, long rest restores HP | 🟢 | M | `Sheet.js` | Rest buttons work and the remaining hit dice are tracked |
| R9 | **Temporary HP**, plus **death saves** at 0 HP | 🟢 | M | `Sheet.html`, `Sheet.js` | Temp HP absorbs damage first; 3 success/fail boxes at 0 HP |
| R10 | **Custom items**: add an item that isn't in `ITEM_CATALOG` | 🟢 | M | `Sheet.html`, `Sheet.js` | A user-named item with a type can be added |
| R11 | **Background, alignment, XP**, and a notes/features text area | 🟢 | S | `Sheet.html`, `Sheet.js` | Fields are saved and loaded |

## 4. Pages & UI

| # | Item | Priority | Size | Files | Done when |
|---|------|----------|------|-------|-----------|
| U1 | **Home page**: list saved characters plus a "New Character" button (`Home.html` is empty) | 🟡 | M | `Home.html`, `Home.js`, `Home.css` | Clicking a character opens `Sheet.html` with it loaded |
| U2 | Recalculate **live on input change** instead of needing Submit | 🟢 | M | `Sheet.js` | Changing Str updates mods and attacks immediately |
| U3 | Sort the skills table alphabetically and show its governing ability (e.g. "Athletics (Str)") | 🟢 | S | `Sheet.html` | Matches the official sheet's order |
| U4 | Pick a project name (the README says "Name TBD") | 🟢 | S | `README.md` | Name chosen |

## 5. Code health

| # | Item | Priority | Size | Files | Done when |
|---|------|----------|------|-------|-----------|
| C1 | Merge the **duplicate `openTab()`** definitions into one | 🟡 | S | `Sheet.js` | One definition remains |
| C2 | Merge the **seven `#submit` click listeners** (one is an exact duplicate) into one handler | 🟡 | S | `Sheet.js` | One listener; behavior unchanged |
| C3 | **Store numbers as numbers** (`Level`, ability scores) instead of strings | 🟡 | S | `Sheet.js` | `stats.json` shows `"Level": 4`, not `"4"` |
| C4 | Add a **`.gitignore`** and untrack `.DS_Store` and `__pycache__/` | 🟡 | S | repo root | `git status` stays clean after running Flask |
| C5 | **Tests**: pytest for the API, `node --test` for `modCalc` / `getProfBonus` / HP math (in `Tests/`) | 🟡 | M | `Tests/` | `python3 -m pytest Tests` and `node --test Tests/` pass |
| C6 | Remove leftover `console.log` debugging | 🟢 | S | `Sheet.js` | The console is quiet in normal use |
| C7 | Fix the misspelled ids (`consitusion`, `intelegence`) and the ids with spaces (`CAC Name`, `CAC Class`) | 🟢 | S | `Sheet.html`, `Sheet.js` | Ids are consistent, and every reference is updated |
| C8 | Update the README's "Things completed so far" list | 🟢 | S | `README.md` | It matches the Retrospective |

---

## Suggested next steps (MVP order)

1. **B1, B2, B3**: finish what's already on screen.
2. **P1 → P2 → P3**: the full save/load loop. This is the biggest missing piece.
3. **R1**: armor-based AC, since inventory already has armor items.
4. **C1, C2, C4, C5**: cleanup and tests before the codebase grows further.
5. **U1**: the Home page as a character picker, built on P1.
