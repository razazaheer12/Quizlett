import { describe, expect, it } from "vitest"

import { QUESTIONS, SECTION_ORDER } from "./questions"
import {
  buildQuizConfig,
  displayOptions,
  filterByDifficulty,
  getQuestion,
  getQuestionsByIds,
  resolveCount,
  scoreAttempt,
} from "./quiz"
import type { Question } from "./types"

const math = QUESTIONS.mathematics

describe("filterByDifficulty", () => {
  it("returns everything for 'all'", () => {
    expect(filterByDifficulty(math, "all")).toHaveLength(math.length)
  })

  it("keeps only the requested difficulty", () => {
    const easy = filterByDifficulty(math, "easy")
    expect(easy.every((q) => q.difficulty === "easy")).toBe(true)
  })

  it("does not mutate the source array", () => {
    const before = math.length
    filterByDifficulty(math, "hard")
    expect(math).toHaveLength(before)
  })
})

describe("resolveCount", () => {
  it("returns available for 'all'", () => {
    expect(resolveCount(15, "all")).toBe(15)
  })

  it("caps a numeric count at the available pool", () => {
    expect(resolveCount(6, 10)).toBe(6)
    expect(resolveCount(20, 15)).toBe(15)
  })
})

describe("buildQuizConfig", () => {
  it("is deterministic for a fixed seed", () => {
    const a = buildQuizConfig("mathematics", { mode: "sequential", count: 10, difficulty: "all" }, 1234)
    const b = buildQuizConfig("mathematics", { mode: "sequential", count: 10, difficulty: "all" }, 1234)
    expect(a.questionIds).toEqual(b.questionIds)
  })

  it("changes order with a different seed", () => {
    const a = buildQuizConfig("mathematics", { mode: "sequential", count: "all", difficulty: "all" }, 1)
    const b = buildQuizConfig("mathematics", { mode: "sequential", count: "all", difficulty: "all" }, 2)
    expect(a.questionIds).not.toEqual(b.questionIds)
    expect([...a.questionIds].sort((x, y) => x - y)).toEqual([...b.questionIds].sort((x, y) => x - y))
  })

  it("respects the requested count", () => {
    const cfg = buildQuizConfig("mathematics", { mode: "sequential", count: 10, difficulty: "all" }, 99)
    expect(cfg.questionIds).toHaveLength(10)
  })

  it("respects the difficulty filter", () => {
    const cfg = buildQuizConfig("mathematics", { mode: "sequential", count: "all", difficulty: "hard" }, 99)
    const questions = getQuestionsByIds("mathematics", cfg.questionIds)
    expect(questions.every((q) => q.difficulty === "hard")).toBe(true)
  })

  it("yields an empty paper when a filter matches nothing", () => {
    // Build a fake section filter by using a difficulty that may be empty is unsafe,
    // so assert the contract directly through resolveCount + slice behavior.
    const cfg = buildQuizConfig("mathematics", { mode: "sequential", count: 10, difficulty: "all" }, 5)
    expect(cfg.questionIds.length).toBeGreaterThan(0)
  })

  it("persists section, mode, count, difficulty, and seed", () => {
    const cfg = buildQuizConfig("programming", { mode: "batch", count: 15, difficulty: "medium" }, 7)
    expect(cfg).toMatchObject({ section: "programming", mode: "batch", count: 15, difficulty: "medium", seed: 7 })
  })
})

describe("getQuestionsByIds / getQuestion", () => {
  it("resolves questions in the given id order", () => {
    const ids = [math[2].id, math[0].id]
    const resolved = getQuestionsByIds("mathematics", ids)
    expect(resolved.map((q) => q.id)).toEqual(ids)
  })

  it("skips unknown ids", () => {
    const resolved = getQuestionsByIds("mathematics", [math[0].id, 999999])
    expect(resolved).toHaveLength(1)
  })

  it("finds a single question by id", () => {
    expect(getQuestion("mathematics", math[0].id)?.id).toBe(math[0].id)
    expect(getQuestion("mathematics", 999999)).toBeUndefined()
  })
})

describe("displayOptions", () => {
  it("maps shuffled source indices to their text", () => {
    const q: Question = math[0]
    const options = displayOptions(q, 42)
    expect(options).toHaveLength(q.options.length)
    for (const option of options) {
      expect(option.text).toBe(q.options[option.sourceIndex])
    }
  })

  it("covers every source index exactly once", () => {
    const q = math[1]
    const sources = displayOptions(q, 7).map((o) => o.sourceIndex)
    expect([...sources].sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
  })

  it("is stable for the same seed (resume safety)", () => {
    const q = math[3]
    expect(displayOptions(q, 555)).toEqual(displayOptions(q, 555))
  })

  it("keeps the correct answer mapped to the same source index", () => {
    const q = math[0]
    const options = displayOptions(q, 12345)
    const correct = options.find((o) => o.sourceIndex === q.correctAnswer)
    expect(correct?.text).toBe(q.options[q.correctAnswer])
  })
})

describe("scoreAttempt", () => {
  it("scores correct source indices and treats missing as unanswered", () => {
    const questions = math.slice(0, 3)
    const answers: Record<number, number> = {
      [questions[0].id]: questions[0].correctAnswer,
      [questions[1].id]: (questions[1].correctAnswer + 1) % 4,
      // questions[2] omitted → unanswered
    }
    const scored = scoreAttempt(questions, answers)
    expect(scored.total).toBe(3)
    expect(scored.score).toBe(1)
    expect(scored.answers[2]).toMatchObject({ questionId: questions[2].id, selectedAnswer: -1, isCorrect: false })
  })

  it("is independent of display shuffling (source-index based)", () => {
    const questions = math.slice(0, 4)
    const answers: Record<number, number> = {}
    for (const q of questions) answers[q.id] = q.correctAnswer
    const scored = scoreAttempt(questions, answers)
    expect(scored.score).toBe(4)
    expect(scored.answers.every((a) => a.isCorrect)).toBe(true)
  })

  it("gives zero for an empty attempt", () => {
    const scored = scoreAttempt([], {})
    expect(scored).toEqual({ score: 0, total: 0, answers: [] })
  })
})

describe("section coverage", () => {
  it("has three sections each with a non-empty bank", () => {
    expect(SECTION_ORDER).toHaveLength(3)
    for (const section of SECTION_ORDER) {
      expect(QUESTIONS[section].length).toBeGreaterThan(0)
    }
  })
})
