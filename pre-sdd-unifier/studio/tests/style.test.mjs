import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readText } from './helpers.mjs';

const studioDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const minimumRatio = 4.5;
const colorLiteral = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\([^)]*\)/gi;
const colorValue = /#[0-9a-f]{3,8}\b|\brgba?\([^)]*\)|\btransparent\b/gi;
const stateSelector = /::|:(?:hover|focus|focus-visible|active|disabled|checked|before|after)\b/;
const minimumRingRatio = 3;
const statePseudo = /:(?:hover|active|focus-visible|focus)\b/;
const ringSelector = /:focus-visible\b/;
const mastTextSelectors =new Set(['.eyebrow', '.beta', '.button.ghost']);
const paletteTextPairs = [
  ['--ink', '--bg'],
  ['--ink', '--surface'],
  ['--muted', '--bg'],
  ['--muted', '--surface'],
  ['--teal', '--surface'],
  ['--amber', '--surface'],
  ['--red', '--surface'],
  ['--dark', '--bg'],
  ['--dark', '--surface'],
  ['--fg-note', '--fill-insight'],
  ['--fg-placeholder', '--fill-panel'],
  ['--fg-button', '--fill-panel'],
  ['--fg-tab-selected', '--fill-tab-selected'],
  ['--fg-error', '--surface'],
  ['--fg-warn', '--surface'],
];

function blocks(text) {
  const found = [];
  let index = 0;
  while (index < text.length) {
    const open = text.indexOf('{', index);
    if (open === -1) break;
    let depth = 1;
    let close = open + 1;
    while (close < text.length && depth > 0) {
      if (text[close] === '{') depth += 1;
      if (text[close] === '}') depth -= 1;
      close += 1;
    }
    found.push({ selector: text.slice(index, open).trim(), body: text.slice(open + 1, close - 1) });
    index = close;
  }
  return found;
}

function declarations(body) {
  const items = [];
  let depth = 0;
  let current = '';
  for (const char of body) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ';' && depth === 0) {
      items.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  items.push(current);
  return items
    .filter((item) => item.includes(':'))
    .map((item) => {
      const split = item.indexOf(':');
      return { property: item.slice(0, split).trim(), value: item.slice(split + 1).replace(/!important\s*$/i, '').trim() };
    });
}

function parseRules(text) {
  return blocks(text).flatMap(({ selector, body }) => (selector.startsWith('@') ? parseRules(body) : [{ selector, declarations: declarations(body) }]));
}

const rules = parseRules(readText(join(studioDir, 'src', 'style.css')));
const isTokenBlock = (rule) => /^:root\b/.test(rule.selector);
const styleRules = rules.filter((rule) => !isTokenBlock(rule));
const tokens = new Map(
  rules
    .filter(isTokenBlock)
    .flatMap((rule) => rule.declarations)
    .filter(({ property }) => property.startsWith('--'))
    .map(({ property, value }) => [property, value]),
);

function resolve(value, trail = []) {
  return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, name) => {
    assert.ok(tokens.has(name), `undefined token ${name}`);
    assert.ok(!trail.includes(name), `token cycle at ${name}`);
    return resolve(tokens.get(name), [...trail, name]);
  });
}

function parseColor(text) {
  const value = text.trim().toLowerCase();
  if (value === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  const hexMatch = value.match(/^#([0-9a-f]{3,8})$/);
  if (hexMatch) {
    const digits = hexMatch[1].length < 5 ? [...hexMatch[1]].map((digit) => digit + digit).join('') : hexMatch[1];
    assert.ok(digits.length === 6 || digits.length === 8, `unsupported colour ${text}`);
    const [r, g, b, a = 255] = digits.match(/../g).map((pair) => parseInt(pair, 16));
    return { r, g, b, a: a / 255 };
  }
  const functionMatch = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  assert.ok(functionMatch, `unsupported colour ${text}`);
  const [, r, g, b, a = '1'] = functionMatch;
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
}

const colorsIn = (value) => (value.match(colorValue) ?? []).map(parseColor);
const over = (top, bottom) => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});
const hex = ({ r, g, b }) => `#${[r, g, b].map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`;

function luminance({ r, g, b }) {
  const channel = (part) => {
    const unit = part / 255;
    return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(over(foreground, background)), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const selectorsOf = (rule) => rule.selector.split(/,(?![^(]*\))/).map((selector) => selector.trim());
const hasText = (rule) => rule.declarations.some(({ property }) => property === 'color');
const backgroundsOf = (rule) =>
  rule.declarations
    .filter(({ property }) => property === 'background' || property === 'background-color')
    .flatMap(({ value }) => colorsIn(resolve(value)))
    .filter((color) => color.a > 0);

function panelSurfaces() {
  const page = parseColor(resolve('var(--bg)'));
  const found = [page, parseColor(resolve('var(--surface)'))];
  for (const rule of styleRules) {
    if (hasText(rule) && rule.selector !== 'body') continue;
    if (selectorsOf(rule).some((selector) => stateSelector.test(selector))) continue;
    found.push(...backgroundsOf(rule).map((color) => over(color, page)));
  }
  return [...new Map(found.map((color) => [hex(color), color])).values()];
}

function mastSurfaces() {
  const mast = styleRules.find((rule) => rule.selector === '.mast');
  assert.ok(mast, '.mast rule not found');
  const stops = backgroundsOf(mast);
  assert.ok(stops.length > 1, '.mast has no gradient stops');
  return stops;
}

const selectorOnMast = (selector) => mastTextSelectors.has(selector) || /^(?:\.mast|header)\s/.test(selector);
const onMast = (rule) => selectorsOf(rule).some(selectorOnMast);
const layered = (own, beneath) => (own.length === 0 ? beneath : own.flatMap((color) => (color.a === 1 ? [color] : beneath.map((surface) => over(color, surface)))));

function rulePairs() {
  const panels = panelSurfaces();
  const mast = mastSurfaces();
  const pairs = [];
  for (const rule of styleRules.filter(hasText)) {
    const surfaces = layered(backgroundsOf(rule), onMast(rule) ? mast : panels);
    for (const { value } of rule.declarations.filter(({ property }) => property === 'color')) {
      const text = parseColor(resolve(value));
      for (const surface of surfaces) pairs.push({ label: rule.selector, text, surface, ratio: contrast(text, surface) });
    }
  }
  return pairs;
}

function statePairs() {
  const panels = panelSurfaces();
  const mast = mastSurfaces();
  const pairs = [];
  for (const rule of styleRules) {
    const own = backgroundsOf(rule);
    if (own.length === 0) continue;
    for (const selector of selectorsOf(rule).filter((item) => statePseudo.test(item))) {
      const base = selector.replace(statePseudo, '');
      const source = hasText(rule) ? rule : styleRules.find((item) => selectorsOf(item).includes(base) && hasText(item));
      if (!source) continue;
      const text = parseColor(resolve(source.declarations.find(({ property }) => property === 'color').value));
      for (const surface of layered(own, selectorOnMast(base) ? mast : panels)) pairs.push({ label: selector, text, surface, ratio: contrast(text, surface) });
    }
  }
  return pairs;
}

function ringPairs() {
  const panels = panelSurfaces();
  const mast = mastSurfaces();
  const rings = [];
  for (const rule of styleRules) {
    const decl = rule.declarations.find(({ property }) => property === 'outline' || property === 'outline-color');
    if (!decl) continue;
    const [color] = colorsIn(resolve(decl.value));
    if (!color) continue;
    for (const selector of selectorsOf(rule).filter((item) => ringSelector.test(item))) rings.push({ selector, color, onMast: selectorOnMast(selector.replace(ringSelector, '')) });
  }
  assert.ok(rings.length > 0, 'no focus ring rule found');
  const mastHasRing = rings.some(({ onMast: mastRing }) => mastRing);
  const pairs = [];
  for (const { selector, color, onMast: mastRing } of rings) {
    const surfaces = mastRing ? mast : mastHasRing ? panels : [...panels, ...mast];
    for (const surface of surfaces) pairs.push({ label: selector, text: color, surface, ratio: contrast(color, surface) });
  }
  return pairs;
}

function palettePairs() {
  return paletteTextPairs.map(([textToken, surfaceToken]) => {
    const text = parseColor(resolve(`var(${textToken})`));
    const surface = parseColor(resolve(`var(${surfaceToken})`));
    return { label: `${textToken} on ${surfaceToken}`, text, surface, ratio: contrast(text, surface) };
  });
}

const formatPair = ({ label, text, surface, ratio }) => `${label}: ${hex(text)} on ${hex(surface)} = ${ratio.toFixed(3)}`;

function lowestPerText(pairs) {
  const lowest = new Map();
  for (const pair of pairs) {
    const key = `${pair.label}|${hex(pair.text)}`;
    if (!lowest.has(key) || pair.ratio < lowest.get(key).ratio) lowest.set(key, pair);
  }
  return [...lowest.values()];
}

test('style_hexOnlyInRootTokens', () => {
  const offenders = [];
  for (const rule of styleRules) {
    for (const { property, value } of rule.declarations) {
      for (const literal of value.match(colorLiteral) ?? []) offenders.push(`${rule.selector} {${property}: ${literal}}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('tokens_textPairs_meet4point5', (t) => {
  const black = parseColor('#000');
  const white = parseColor('#fff');
  assert.ok(Math.abs(contrast(black, white) - 21) < 1e-9);
  assert.ok(contrast(parseColor('#767676'), white) >= minimumRatio);
  assert.ok(contrast(parseColor('#777777'), white) < minimumRatio);
  const pairs = [...rulePairs(), ...palettePairs()];
  t.diagnostic(`${pairs.length} text pairs checked`);
  assert.deepEqual(lowestPerText(pairs).filter(({ ratio }) => ratio < minimumRatio).map(formatPair), []);
});

test('tokens_stateText_meet4point5', (t) => {
  const pairs = statePairs();
  assert.ok(pairs.length > 0, 'no state pairs found');
  t.diagnostic(`${pairs.length} state text pairs checked`);
  assert.deepEqual(lowestPerText(pairs).filter(({ ratio }) => ratio < minimumRatio).map(formatPair), []);
});

test('tokens_focusRing_meet3', (t) => {
  const pairs = ringPairs();
  t.diagnostic(`${pairs.length} focus ring pairs checked`);
  assert.deepEqual(lowestPerText(pairs).filter(({ ratio }) => ratio < minimumRingRatio).map(formatPair), []);
});

test('tokens_keyColors_present', () => {
  assert.equal(tokens.get('--teal')?.toLowerCase(), '#0c8286');
  assert.equal(tokens.get('--dark')?.toLowerCase(), '#0c2138');
});

test('tokens_varReferences_allDefined', () => {
  const missing = [];
  for (const rule of rules) {
    for (const { property, value } of rule.declarations) {
      for (const [, name] of value.matchAll(/var\(\s*(--[\w-]+)/g)) if (!tokens.has(name)) missing.push(`${rule.selector} {${property}: ${name}}`);
    }
  }
  assert.deepEqual(missing, []);
});
