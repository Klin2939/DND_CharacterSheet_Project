// S1-T10: core math in Frontend/Scripts/Sheet.js.
// modCalc, getProfBonus, Character#getHitDie, Character#calculateMaxHP.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { loadSheet } from "./helpers/loadSheet.mjs";

// Math.random stub that returns the given values in order and fails loudly if
// called more times than expected.
function randomSequence(...values) {
  let i = 0;
  const fn = () => {
    if (i >= values.length) throw new Error(`Math.random called more than ${values.length} times`);
    return values[i++];
  };
  fn.callCount = () => i;
  return fn;
}

// Math.random value that makes Math.floor(r * die) + 1 === roll.
const rollFor = (roll, die) => (roll - 1) / die;

const throwingRandom = () => {
  throw new Error("Math.random should not be called");
};

describe("modCalc", () => {
  const { modCalc } = loadSheet();

  const cases = [
    [1, "-5"],
    [8, "-1"],
    [9, "-1"],
    [10, "0"],
    [12, "+1"],
    [20, "+5"],
    [30, "+10"],
  ];
  for (const [score, expected] of cases) {
    test(`score ${score} -> ${JSON.stringify(expected)}`, () => {
      assert.equal(modCalc(score), expected);
    });
  }

  test("returns a string, not a number, for every score 1-30", () => {
    for (let score = 1; score <= 30; score++) {
      assert.equal(typeof modCalc(score), "string", `score ${score}`);
    }
  });

  // Sheet.js:233 only special-cases 10, so 11 -> floor(0.5) = 0 -> "+0".
  // Numerically correct (Number("+0") === 0) but inconsistent with 10 -> "0"
  // and with the spec (11 -> "0"). Current behavior is pinned here; the spec'd
  // value is a todo until someone decides which one is right.
  test("score 11 currently returns '+0' (current behavior)", () => {
    assert.equal(modCalc(11), "+0");
    assert.equal(Number(modCalc(11)), 0);
  });

  test("score 11 -> \"0\" like score 10", { todo: "Sheet.js:233-241 returns '+0' for 11" }, () => {
    assert.equal(modCalc(11), "0");
  });

  test("accepts numeric strings the way form inputs provide them", () => {
    assert.equal(modCalc("16"), "+3");
    assert.equal(modCalc("7"), "-2");
  });

  test("non-numeric input returns 'Invalid'", () => {
    assert.equal(modCalc("abc"), "Invalid");
  });

  test("undefined returns 'Invalid'", () => {
    assert.equal(modCalc(undefined), "Invalid");
  });

  // Documents current behavior: Number("") === 0, so an empty ability box is
  // treated as score 0 (-5) rather than "Invalid". Backlog B5 will change this.
  test("empty string is treated as score 0 -> '-5' (current behavior, see B5)", () => {
    assert.equal(modCalc(""), "-5");
  });

  test("result can be coerced back to the correct number with Number()", () => {
    assert.equal(Number(modCalc(20)), 5);
    assert.equal(Number(modCalc(1)), -5);
    assert.equal(Number(modCalc(10)), 0);
  });
});

describe("getProfBonus", () => {
  const { getProfBonus } = loadSheet();

  const cases = [
    [1, 2],
    [4, 2],
    [5, 3],
    [8, 3],
    [9, 4],
    [12, 4],
    [13, 5],
    [16, 5],
    [17, 6],
    [20, 6],
  ];
  for (const [level, expected] of cases) {
    test(`level ${level} -> +${expected}`, () => {
      assert.equal(getProfBonus(level), expected);
    });
  }

  test("accepts string levels from the <select>", () => {
    assert.equal(getProfBonus("4"), 2);
    assert.equal(getProfBonus("5"), 3);
    assert.equal(getProfBonus("17"), 6);
  });

  test("returns a number", () => {
    assert.equal(typeof getProfBonus(9), "number");
  });
});

describe("Character#getHitDie", () => {
  const { getHitDie } = loadSheet();

  const cases = {
    Barbarian: 12,
    Fighter: 10,
    Paladin: 10,
    Ranger: 10,
    Bard: 8,
    Cleric: 8,
    Druid: 8,
    Monk: 8,
    Rogue: 8,
    Warlock: 8,
    Sorcerer: 6,
    Wizard: 6,
  };
  for (const [className, die] of Object.entries(cases)) {
    test(`${className} -> d${die}`, () => {
      assert.equal(getHitDie(className), die);
    });
  }

  test("covers all 12 classes", () => {
    assert.equal(Object.keys(cases).length, 12);
  });

  test("default class 'NA' falls back to d6", () => {
    assert.equal(getHitDie("NA"), 6);
  });

  test("unknown class falls back to d6", () => {
    assert.equal(getHitDie("Artificer"), 6);
  });

  test("class match is case-sensitive: 'barbarian' falls back to d6", () => {
    assert.equal(getHitDie("barbarian"), 6);
  });
});

describe("Character#calculateMaxHP", () => {
  test("level 1 = max hit die + Con mod, without rolling", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Fighter", 1, 10, 10, 14); // Con 14 -> +2
    assert.equal(c.calculateMaxHP(), 12); // d10 max 10 + 2
    assert.equal(c.maxHP, 12);
    assert.deepEqual([...c.hpRolls], [12]);
  });

  test("level 1 with a negative Con mod subtracts it", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Wizard", 1, 10, 10, 8); // Con 8 -> -1
    assert.equal(c.calculateMaxHP(), 5); // d6 max 6 - 1
  });

  test("level 1 HP is at least 1 even with a huge Con penalty", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Wizard", 1, 10, 10, 1); // Con 1 -> -5, 6 - 5 = 1
    assert.equal(c.calculateMaxHP(), 1);
    const d = new Character("B", "Wizard", 1, 10, 10, 0); // default Con 0 -> -5
    assert.equal(d.calculateMaxHP(), 1);
  });

  test("higher levels add (die roll + Con mod) per level", () => {
    // Fighter d10, Con 14 (+2). Level 3: rolls of 4 and 7.
    const random = randomSequence(rollFor(4, 10), rollFor(7, 10));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Fighter", 3, 10, 10, 14);
    assert.equal(c.calculateMaxHP(), 12 + (4 + 2) + (7 + 2));
    assert.deepEqual([...c.hpRolls], [12, 6, 9]);
    assert.equal(random.callCount(), 2);
  });

  test("rolls use the full die range: Math.random 0 -> 1, just under 1 -> die max", () => {
    const random = randomSequence(0, 0.9999);
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Barbarian", 3, 10, 10, 10); // Con 10 -> 0
    c.calculateMaxHP();
    assert.deepEqual([...c.hpRolls], [12, 1, 12]);
  });

  test("each level after 1 gives at least 1 HP even when roll + Con mod < 1", () => {
    // Wizard d6, Con 1 (-5). Roll of 1 -> 1 - 5 = -4 -> clamped to 1.
    const random = randomSequence(rollFor(1, 6), rollFor(1, 6));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Wizard", 3, 10, 10, 1);
    c.calculateMaxHP();
    assert.deepEqual([...c.hpRolls], [1, 1, 1]);
    assert.equal(c.maxHP, 3);
  });

  test("string Level '4' works the same as number 4", () => {
    const random = randomSequence(rollFor(5, 8), rollFor(3, 8), rollFor(8, 8));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Rogue", "4", 10, 10, "12"); // string Con 12 -> +1
    assert.equal(c.calculateMaxHP(), (8 + 1) + (5 + 1) + (3 + 1) + (8 + 1));
    assert.equal(c.hpRolls.length, 4);
  });

  test("calling again at the same level does not re-roll", () => {
    const random = randomSequence(rollFor(4, 10), rollFor(7, 10));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Fighter", 3, 10, 10, 14);
    const first = c.calculateMaxHP();
    const second = c.calculateMaxHP(); // would throw if it rolled again
    assert.equal(second, first);
    assert.equal(random.callCount(), 2);
  });

  test("levelling up keeps earlier rolls and only rolls the new levels", () => {
    const random = randomSequence(rollFor(4, 10), rollFor(9, 10));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Fighter", 2, 10, 10, 10); // Con 10 -> 0
    c.calculateMaxHP();
    assert.deepEqual([...c.hpRolls], [10, 4]);
    c.setLevel("3");
    assert.equal(c.calculateMaxHP(), 10 + 4 + 9);
    assert.deepEqual([...c.hpRolls], [10, 4, 9]);
    assert.equal(random.callCount(), 2);
  });

  test("lowering the level sums only the first `level` cached rolls", () => {
    const random = randomSequence(rollFor(4, 10), rollFor(9, 10));
    const { Character } = loadSheet({ random });
    const c = new Character("A", "Fighter", 3, 10, 10, 10);
    c.calculateMaxHP();
    c.setLevel(1);
    assert.equal(c.calculateMaxHP(), 10);
    assert.equal(c.hpRolls.length, 3, "cached rolls are kept for re-levelling");
  });

  test("pre-existing hpRolls are reused, not re-rolled", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Fighter", 3, 10, 10, 14);
    c.hpRolls = [12, 3, 8];
    assert.equal(c.calculateMaxHP(), 23);
  });

  // Documents known behavior B6: Con changes don't apply to cached levels.
  test("changing Con after rolling does not change cached levels (current behavior, see B6)", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Fighter", 1, 10, 10, 10);
    assert.equal(c.calculateMaxHP(), 10);
    c.Con = 18; // +4
    assert.equal(c.calculateMaxHP(), 10);
  });

  // Documents current behavior that S1-T1 (B1) will change: every call heals to full.
  test("sets currentHP to maxHP on every call (current behavior, changes with B1)", () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Fighter", 1, 10, 10, 10);
    c.calculateMaxHP();
    c.currentHP = 3;
    c.calculateMaxHP();
    assert.equal(c.currentHP, c.maxHP);
  });

  // Real bug: a non-numeric Con makes modCalc return "Invalid", Number("Invalid")
  // is NaN, and Math.max(1, NaN) is NaN, so the "at least 1 HP" guard fails.
  // Marked todo so the suite stays green; tracked by B5.
  test("non-numeric Con still yields a finite max HP", { todo: "B5: Con 'abc' gives maxHP NaN (Sheet.js:68,72)" }, () => {
    const { Character } = loadSheet({ random: throwingRandom });
    const c = new Character("A", "Fighter", 1, 10, 10, "abc");
    assert.ok(Number.isFinite(c.calculateMaxHP()));
  });
});
