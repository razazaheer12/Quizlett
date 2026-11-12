import { describe, expect, it } from "vitest"

import { ACHIEVEMENTS, computeEarned } from "./achievements"
import type { SectionId, SectionResult } from "./types"

function makeResult(section: SectionId, score: number, total: number): SectionResult {
  return {
    section,
    score,
    totalQuestions: total,
    answers: [],
    mode: "batch",
    difficulty: "all",
    seed: 0,
    completedAt: new Date().toISOString(),
  }
}

describe("ACHIEVEMENTS registry", () => {
  it("keeps all five original achievements", () => {
    expect(ACHIEVEMENTS.map((a) => a.id)).toEqual([
      "math_whiz",
      "code_master",
      "knowledge_guru",
      "quiz_master",
      "perfectionist",
    ])
  })
})

describe("computeEarned", () => {
  it("awards nothing for an empty result set", () => {
    expect(computeEarned([])).toEqual([])
  })

  it("awards a section badge only on a perfect attempt", () => {
    expect(computeEarned([makeResult("mathematics", 10, 10)])).toContain("math_whiz")
    expect(computeEarned([makeResult("mathematics", 9, 10)])).not.toContain("math_whiz")
  })

  it("is length-agnostic — a perfect 15-question attempt still counts", () => {
    expect(computeEarned([makeResult("programming", 15, 15)])).toContain("code_master")
    expect(computeEarned([makeResult("generalKnowledge", 7, 7)])).toContain("knowledge_guru")
  })

  it("does not award perfection for a zero-total attempt", () => {
    expect(computeEarned([makeResult("mathematics", 0, 0)])).not.toContain("math_whiz")
  })

  it("awards quiz_master when all three sections are present", () => {
    const results = [
      makeResult("mathematics", 5, 10),
      makeResult("programming", 5, 10),
      makeResult("generalKnowledge", 5, 10),
    ]
    expect(computeEarned(results)).toContain("quiz_master")
  })

  it("does not award quiz_master when a section is missing", () => {
    const results = [makeResult("mathematics", 10, 10), makeResult("programming", 10, 10)]
    expect(computeEarned(results)).not.toContain("quiz_master")
  })

  it("awards perfectionist only when all three are present AND perfect", () => {
    const perfect = [
      makeResult("mathematics", 10, 10),
      makeResult("programming", 15, 15),
      makeResult("generalKnowledge", 8, 8),
    ]
    const earned = computeEarned(perfect)
    expect(earned).toContain("perfectionist")
    expect(earned).toEqual(
      expect.arrayContaining(["math_whiz", "code_master", "knowledge_guru", "quiz_master", "perfectionist"]),
    )
  })

  it("withholds perfectionist when one section is imperfect", () => {
    const mixed = [
      makeResult("mathematics", 10, 10),
      makeResult("programming", 14, 15),
      makeResult("generalKnowledge", 8, 8),
    ]
    const earned = computeEarned(mixed)
    expect(earned).toContain("quiz_master")
    expect(earned).not.toContain("perfectionist")
    expect(earned).not.toContain("code_master")
  })

  it("returns ids in registry order and never duplicates", () => {
    const perfect = [
      makeResult("mathematics", 10, 10),
      makeResult("programming", 10, 10),
      makeResult("generalKnowledge", 10, 10),
    ]
    const earned = computeEarned(perfect)
    expect(new Set(earned).size).toBe(earned.length)
    const order = ACHIEVEMENTS.map((a) => a.id)
    expect(earned).toEqual([...earned].sort((a, b) => order.indexOf(a) - order.indexOf(b)))
  })
})
