// Smoke test: Sheet.js loads in the vm harness and exposes what tests need.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSheet } from "./helpers/loadSheet.mjs";

test("Sheet.js loads in the vm harness and exposes its core API", () => {
  const sheet = loadSheet();
  assert.equal(typeof sheet.modCalc, "function");
  assert.equal(typeof sheet.getProfBonus, "function");
  assert.equal(typeof sheet.Character, "function");
  assert.ok(sheet.newCac instanceof sheet.Character);
  assert.equal(sheet.getHitDie("Barbarian"), 12);
});

test("Sheet.js registers its #submit click listeners and DOMContentLoaded handlers", () => {
  const sheet = loadSheet();
  const submit = sheet.document.elements.get("submit");
  assert.ok(submit, "Sheet.js should look up #submit at load time");
  assert.ok((submit.listeners.click || []).length > 0);
  assert.ok((sheet.document.listeners.DOMContentLoaded || []).length > 0);
});

test("Sheet.js pings the backend once on load via the stubbed fetch", () => {
  const sheet = loadSheet();
  assert.deepEqual(sheet.fetchCalls.map((c) => c.url), ["http://127.0.0.1:5000"]);
});
