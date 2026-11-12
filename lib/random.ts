/**
 * Pure, deterministic randomization for quiz attempts.
 *
 * Everything here is reproducible from a numeric seed so an attempt can be
 * resumed after reload with the exact same question and option order. Selections
 * are stored as SOURCE option indices, so shuffling the display order never
 * invalidates a saved answer.
 */

/** mulberry32 — small, fast, well-distributed 32-bit PRNG. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Combine a seed with a question id into a stable, well-spread integer seed. */
export function deriveSeed(seed: number, questionId: number): number {
  let h = (seed >>> 0) ^ Math.imul(questionId >>> 0, 0x9e3779b1)
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}

/** Deterministic Fisher–Yates shuffle. Returns a new array; never mutates input. */
export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const out = items.slice()
  const rng = createRng(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

/**
 * Display order for a question's options: a permutation of SOURCE indices
 * `[0 .. optionCount-1]`, deterministic for a given (seed, questionId) pair.
 */
export function optionOrder(optionCount: number, seed: number, questionId: number): number[] {
  const indices = Array.from({ length: optionCount }, (_, i) => i)
  return shuffle(indices, deriveSeed(seed, questionId))
}

/** A fresh, non-deterministic seed for starting a new attempt. */
export function createSeed(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0] >>> 0
  }
  return (Math.random() * 0xffffffff) >>> 0
}
