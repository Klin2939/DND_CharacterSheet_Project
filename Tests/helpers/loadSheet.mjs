// Load Frontend/Scripts/Sheet.js into an isolated node:vm context so its pure
// functions and the Character class can be tested without a browser.
//
// Sheet.js is a plain browser script with no exports. At load time it calls
// document.getElementById(...).addEventListener(...), document.addEventListener
// ('DOMContentLoaded', ...) and fetch(...), so we provide inert stubs for those.
//
// Top-level `function` declarations become properties of the vm global, but
// top-level `class` / `const` / `let` declarations do NOT. To reach them we
// append one expression to the evaluated source; vm.runInContext returns the
// value of the script's last expression statement. Sheet.js itself is never
// modified on disk.
//
// Every call to loadSheet() builds a fresh context, so tests don't share state.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SHEET_PATH = path.resolve(HERE, "..", "..", "Frontend", "Scripts", "Sheet.js");

// Names declared with class/const/let at the top level of Sheet.js.
// If one is renamed or removed in Sheet.js, update this list.
// Note: these are snapshots of the bindings at load time. `inventory` is only
// mutated in place (push/splice) so the reference stays live; a `let` that
// Sheet.js reassigns (e.g. catalogFilteredItems) would go stale, so it is omitted.
const LEXICAL_EXPORTS = ["Character", "newCac", "inventory", "ITEM_CATALOG"];

// A minimal fake DOM element: enough for the property writes and listener
// registrations Sheet.js performs. Listeners are recorded so tests can fire them.
function makeElement(id = null) {
  const listeners = {};
  return {
    id,
    value: "",
    innerHTML: "",
    textContent: "",
    className: "",
    checked: false,
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    listeners,
    addEventListener(type, fn) {
      (listeners[type] ||= []).push(fn);
    },
    removeEventListener() {},
    dispatch(type, event = {}) {
      for (const fn of listeners[type] || []) fn.call(this, event);
    },
  };
}

function makeDocument() {
  const elements = new Map();
  const documentListeners = {};
  const getElementById = (id) => {
    if (!elements.has(id)) elements.set(id, makeElement(id));
    return elements.get(id);
  };
  return {
    elements,
    listeners: documentListeners,
    getElementById,
    querySelector: () => makeElement(),
    querySelectorAll: () => [],
    getElementsByClassName: () => [],
    addEventListener(type, fn) {
      (documentListeners[type] ||= []).push(fn);
    },
    removeEventListener() {},
    dispatch(type, event = {}) {
      for (const fn of documentListeners[type] || []) fn.call(this, event);
    },
  };
}

const silentConsole = { log() {}, error() {}, warn() {}, info() {}, debug() {} };

/**
 * Load Sheet.js in a fresh vm context.
 *
 * @param {object} [options]
 * @param {() => number} [options.random] replacement for Math.random inside the sheet
 * @param {object} [options.console] console to expose (default: silent)
 * @returns {{
 *   modCalc: Function, getProfBonus: Function, Character: Function, newCac: object,
 *   getHitDie: (className: string) => number,
 *   inventory: Array, ITEM_CATALOG: Array,
 *   context: object, document: object, fetchCalls: Array,
 * }}
 */
export function loadSheet(options = {}) {
  const source = readFileSync(SHEET_PATH, "utf8");
  const document = makeDocument();
  const fetchCalls = [];
  const fetch = (url, init) => {
    fetchCalls.push({ url, init });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
  };

  const context = vm.createContext({
    document,
    fetch,
    console: options.console ?? silentConsole,
  });

  // Each vm context has its own Math; stub random there, not on Node's Math.
  if (options.random) {
    vm.runInContext("Math", context).random = options.random;
  }

  const lexical = vm.runInContext(
    `${source}\n;({ ${LEXICAL_EXPORTS.join(", ")} });`,
    context,
    { filename: SHEET_PATH },
  );

  const { Character } = lexical;
  return {
    ...lexical,
    modCalc: context.modCalc,
    getProfBonus: context.getProfBonus,
    // getHitDie is a Character method; this wrapper reads it for a given class name.
    getHitDie: (className) => new Character("Test", className).getHitDie(),
    context,
    document,
    fetchCalls,
  };
}
