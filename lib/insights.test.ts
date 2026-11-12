import { describe, expect, it } from "vitest"

import {
  accuracyPercent,
  answeredCount,
  firstUnanswered,
  needsReviewSection,
  overallStats,
  performanceTier,
  sectionInsight,
  strongestSection,
} from "./insights"
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

describe("accuracyPercent", () => {
  it("rounds to a whole percentage", () => {
    expect(accuracyPercent(1, 3)).toBe(33)
    expect(accuracyPercent(2, 3)).toBe(67)
    expect(accuracyPercent(7, 8)).toBe(88)
  })

  it("returns 0 for a zero total (no NaN)", () => {
    expect(accuracyPercent(0, 0)).toBe(0)
    expect(accuracyPercent(5, 0)).toBe(0)
  })

  it("returns 100 for a perfect score", () => {
    expect(accuracyPercent(15, 15)).toBe(100)
  })
})

describe("overallStats", () => {
  it("sums variable-length attempts", () => {
    const stats = overallStats([makeResult("mathematics", 8, 10), makeResult("programming", 12, 15)])
    expect(stats.totalScore).toBe(20)
    expect(stats.totalQuestions).toBe(25)
    expect(stats.accuracy).toBe(80)
    expect(stats.completedSections).toBe(2)
  })

  it("handles an empty result set", () => {
    expect(overallStats([])).toEqual({
      completedSections: 0,
      totalScore: 0,
      totalQuestions: 0,
      accuracy: 0,
    })
  })
})

describe("performanceTier (percentage-based, length-agnostic)", () => {
  it("is muted for a zero total", () => {
    expect(performanceTier(0, 0).tone).toBe("muted")
  })

  it("awards Perfect only at 100%", () => {
    expect(performanceTier(10, 10).title).toBe("Perfect score")
    expect(performanceTier(15, 15).title).toBe("Perfect score")
    expect(performanceTier(14, 15).title).not.toBe("Perfect score")
  })

  it("uses the 80% Excellent boundary", () => {
    expect(performanceTier(8, 10).title).toBe("Excellent performance")
    expect(performanceTier(12, 15).title).toBe("Excellent performance")
    expect(performanceTier(7, 10).title).not.toBe("Excellent performance")
  })

  it("uses the 60% Good boundary", () => {
    expect(performanceTier(6, 10).title).toBe("Good work")
    expect(performanceTier(9, 15).title).toBe("Good work")
    expect(performanceTier(5, 10).title).toBe("Keep learning")
  })

  it("gives the same tier for equal percentages at different lengths", () => {
    expect(performanceTier(8, 10).tone).toEqual(performanceTier(12, 15).tone)
  })
})

describe("strongestSection / needsReviewSection", () => {
  const results = [makeResult("mathematics", 5, 10), makeResult("programming", 9, 10), makeResult("generalKnowledge", 7, 10)]

  it("picks the highest ratio as strongest", () => {
    expect(strongestSection(results)?.section).toBe("programming")
  })

  it("picks the lowest ratio as needing review", () => {
    expect(needsReviewSection(results)?.section).toBe("mathematics")
  })

  it("compares by ratio, not raw score, across variable lengths", () => {
    const mixed = [makeResult("mathematics", 6, 15), makeResult("programming", 5, 5)]
    expect(strongestSection(mixed)?.section).toBe("programming")
    expect(needsReviewSection(mixed)?.section).toBe("mathematics")
  })

  it("returns null for no results", () => {
    expect(strongestSection([])).toBeNull()
    expect(needsReviewSection([])).toBeNull()
  })
})

describe("sectionInsight", () => {
  it("returns a non-empty string for every band", () => {
    expect(sectionInsight("mathematics", 10, 10).length).toBeGreaterThan(0)
    expect(sectionInsight("mathematics", 0, 10).length).toBeGreaterThan(0)
  })

  it("does not divide by zero", () => {
    expect(() => sectionInsight("mathematics", 0, 0)).not.toThrow()
  })
})

describe("answeredCount / firstUnanswered", () => {
  it("counts answered questions", () => {
    expect(answeredCount({ 1: 0, 2: 3 })).toBe(2)
    expect(answeredCount({})).toBe(0)
  })

  it("finds the first unanswered index or null", () => {
    const questions = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(firstUnanswered(questions, { 1: 0 })).toBe(1)
    expect(firstUnanswered(questions, { 1: 0, 2: 1, 3: 2 })).toBeNull()
  })
})
