# Retrospective

_Covers: 2025-10-01 → 2026-11-19 (project start to now)_

A look back at everything built so far on the D&D Character Sheet, how it came together, and what to carry forward.
For what's still left, see [Backlog.md](Backlog.md).

---

## Completed features

### Character basics
- [x] Character name input
- [x] Level select (1–20)
- [x] Class select (all 12 PHB classes)
- [x] Race select (9 PHB races), added 2026-06-02
- [x] `Character` class as the single in-memory model (`newCac`) that holds all sheet state

### Ability scores & skills
- [x] Six ability score inputs
- [x] `modCalc()` modifier calculation with signed display (`+2`, `-1`, `0`), with negatives fixed in May 2026
- [x] Modifier boxes update on Submit
- [x] Skill table of 18 skills, each tied to its ability through a CSS class, so one modifier fills many cells

### Combat stats
- [x] **Hit Points**: rolled max HP per level, using the class hit die (d6–d12) + Con mod. Level 1 is always the max die. Rolls are cached in `hpRolls` so they don't re-roll.
- [x] **HP tracking**: +/− buttons, capped between 0 and max HP, with a `current/max` display
- [x] **Armor Class** box (10 + Dex mod)
- [x] **Proficiency Bonus** box (+2 to +6 by level)

### Tabs, inventory & attacks
- [x] **Actions / Skills / Inventory** tabs (the placeholder "London/Paris" tabs were removed)
- [x] **Item catalog** popup with 27 items (weapons, armor, magic items, consumables), with search and type filter
- [x] **Inventory list** with type filter, editable quantity, and a remove button
- [x] **Weapon proficiency** checkbox per weapon
- [x] **Attack table** on the Actions tab, built from inventory weapons: to-hit = Str/Dex mod + PB if proficient; damage = die + mod

### Backend & saving
- [x] Flask API with CORS (`api/main.py`), plus a `GET /` reachability check on page load
- [x] **Save Character** button → `POST /save` → `api/stats.json`
- [x] Save is an **upsert** keyed by character name (saving again overwrites instead of duplicating)
- [x] `requirements.txt` (flask, flask-cors)

### Project structure & tooling
- [x] Files reorganized into `Frontend/` (`Scripts/`, `Stylesheets/`) and `api/`
- [x] `Home.html` / `Home.js` / `Home.css` created as stubs for a future home page
- [x] `CLAUDE.md` and project-specific Claude Code subagents (code-reviewer, test-writer, project-manager, game-app-dev)

---

## Timeline

| When | Milestone |
|------|-----------|
| **Oct 2025** | First HTML/CSS/JS upload; `Character` class set up |
| Oct 23, 2025 | Class + JSON working; ability scores fixed; skills table filled from mods |
| Oct 29 – Nov 15, 2025 | Hit point box built and positioned; AC label added |
| Nov 19, 2025 | README updated with project goals and progress |
| **Nov 22 – 29, 2025** | First Flask integration and REST API test |
| Feb 11, 2026 | **Save button → backend → `stats.json`** working end to end |
| May 2, 2026 | AI-assisted refactor of HTML/CSS/JS |
| May 6, 2026 | Big CSS and layout overhaul (+452 lines) |
| May 17, 2026 | `modCalc` fixed (`0` instead of `+0`); tab layout without absolute positioning |
| May 24 – 27, 2026 | Health system reworked; **rolled max HP** finished |
| Jun 2, 2026 | Race selection added |
| Aug 20, 2026 | HP + Save: upsert by name in the API |
| Sep 6, 2026 | Inventory, item catalog, weapon attacks, and proficiency bonus added; files renamed to `Sheet.*` |
| Oct 9, 2026 | Folder restructure into `Frontend/` |
| Nov 19, 2026 | Claude Code setup: `CLAUDE.md`, subagents, this documentation |

---

## What went well
- **Steady, visible progress**: every stretch of work produced something you could see on the page (mods → skills → HP → AC → tabs → inventory → attacks).
- **Got the hard part working**: the frontend → Flask → JSON file save loop is the trickiest piece of a beginner web app, and it works.
- **Kept the rules accurate**: the modifier formula, PB-by-level table, hit dice per class, and attack bonus all match 5e.
- **Made a deliberate design choice**: rolling HP instead of taking the average, with caching so the rolls stay stable.
- **Cleaned up as you went**: removed the placeholder tabs, fixed `+0`, and moved files into a sensible folder structure.

## What was hard / what slowed things down
- **Getting the HP display to update** took several sessions (May 24–27, "still not working, but I think I'm on the right track"), mostly from state being spread across functions.
- **Long gaps** between work sessions (Dec–Jan, Feb–May, Jun–Aug) meant time spent re-learning the code.
- **Copy-paste listeners**: each field got its own `#submit` listener, and `openTab()` was written twice, which makes the flow harder to follow.
- **Strings vs. numbers** from form inputs caused modifier and math bugs that needed `Number(...)` patches.
- **Commit messages** sometimes didn't describe the change ("idk", "Update", "Batman"), which makes it harder to look back.

## What to carry forward
1. **Finish what's on screen before adding more**: several UI elements are visible but not wired up yet (skill proficiency checkboxes, HP amount input, inventory search). See Backlog §1.
2. **Close the save/load loop**: saving without loading is only half a feature. That's the top Must item.
3. **One handler, one state object**: consolidate the submit listeners and keep all derived stats recalculating from `newCac` in one place.
4. **Add a few tests** for the math (`modCalc`, `getProfBonus`, HP) so refactors don't break rules that already work.
5. **Write descriptive commit messages** ("Add armor-based AC", not "Update"). Future-you will thank you, especially after a long break.
6. **Add a `.gitignore`** so `.DS_Store` and `__pycache__` stop showing up in commits.
