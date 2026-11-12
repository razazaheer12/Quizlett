import { describe, expect, it } from "vitest"

import { createRng, createSeed, deriveSeed, optionOrder, shuffle } from "./random"

describe("createRng", () => {
  it("is deterministic for a given seed", () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = [a(), a(), a()]
    const seqB = [b(), b(), b()]
    expect(seqA).toEqual(seqB)
  })

  it("produces values in [0, 1)", () => {
    const rng = createRng(7)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it("differs across seeds", () => {
    expect(createRng(1)()).not.toEqual(createRng(2)())
  })
})

describe("deriveSeed", () => {
  it("is stable for the same inputs", () => {
    expect(deriveSeed(123, 9)).toEqual(deriveSeed(123, 9))
  })

  it("spreads by question id", () => {
    expect(deriveSeed(123, 1)).not.toEqual(deriveSeed(123, 2))
  })

  it("returns a non-negative 32-bit integer", () => {
    const v = deriveSeed(999, 42)
    expect(Number.isInteger(v)).toBe(true)
    expect(v).toBeGreaterThanOrEqual(0)
  })
})

describe("shuffle", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8]

  it("does not mutate the input", () => {
    const copy = [...items]
    shuffle(copy, 5)
    expect(copy).toEqual(items)
  })

  it("returns the same multiset of elements", () => {
    const out = shuffle(items, 5)
    expect([...out].sort((a, b) => a - b)).toEqual(items)
  })

  it("is deterministic for a given seed", () => {
    expect(shuffle(items, 11)).toEqual(shuffle(items, 11))
  })

  it("produces a different order for a different seed", () => {
    expect(shuffle(items, 11)).not.toEqual(shuffle(items, 12))
  })
})

describe("optionOrder", () => {
  it("is a permutation of source indices", () => {
    const order = optionOrder(4, 3, 17)
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
  })

  it("is deterministic for the same (seed, questionId)", () => {
    expect(optionOrder(4, 3, 17)).toEqual(optionOrder(4, 3, 17))
  })

  it("changes when the question id changes", () => {
    expect(optionOrder(4, 3, 17)).not.toEqual(optionOrder(4, 3, 18))
  })

  it("handles a single option", () => {
    expect(optionOrder(1, 3, 1)).toEqual([0])
  })
})

describe("createSeed", () => {
  it("returns a non-negative 32-bit integer", () => {
    const seed = createSeed()
    expect(Number.isInteger(seed)).toBe(true)
    expect(seed).toBeGreaterThanOrEqual(0)
  })
})
