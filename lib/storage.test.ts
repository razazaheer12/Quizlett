import { beforeEach, describe, expect, it } from "vitest"

import { SCHEMA_VERSION } from "./schemas"
import {
  buildExportBundle,
  clearHistory,
  clearProgress,
  loadHistory,
  loadProgress,
  loadTheme,
  migrateV1Progress,
  parseImport,
  saveHistory,
  saveProgress,
  saveTheme,
  EMPTY_PROGRESS,
} from "./storage"
import type { AttemptRecord, QuizProgress } from "./types"

const PROGRESS_KEY = "quizProgress"
const HISTORY_KEY = "quizHistory"
const THEME_KEY = "theme"

beforeEach(() => {
  window.localStorage.clear()
})

function attempt(id: string, section: AttemptRecord["section"], correct: number, total: number): AttemptRecord {
  return {
    id,
    section,
    completedAt: new Date().toISOString(),
    correct,
    total,
    accuracy: Math.round((correct / total) * 100),
    mode: "batch",
    difficulty: "all",
    durationMs: null,
  }
}

describe("loadProgress", () => {
  it("returns EMPTY_PROGRESS when nothing is stored", () => {
    expect(loadProgress()).toEqual(EMPTY_PROGRESS)
  })

  it("returns EMPTY_PROGRESS on corrupt JSON", () => {
    window.localStorage.setItem(PROGRESS_KEY, "{not valid json")
    expect(loadProgress()).toEqual(EMPTY_PROGRESS)
  })

  it("returns EMPTY_PROGRESS when the stored value is a non-object", () => {
    window.localStorage.setItem(PROGRESS_KEY, "42")
    expect(loadProgress()).toEqual(EMPTY_PROGRESS)
  })

  it("round-trips a saved v2 progress object", () => {
    const progress: QuizProgress = {
      ...EMPTY_PROGRESS,
      results: [
        {
          section: "mathematics",
          score: 8,
          totalQuestions: 10,
          answers: [{ questionId: 1, selectedAnswer: 0, isCorrect: true }],
          mode: "sequential",
          difficulty: "all",
          seed: 5,
          completedAt: new Date().toISOString(),
        },
      ],
      totalScore: 8,
      earnedAchievements: [],
    }
    saveProgress(progress)
    const loaded = loadProgress()
    expect(loaded.results).toHaveLength(1)
    expect(loaded.results[0].score).toBe(8)
    expect(loaded.results[0].totalQuestions).toBe(10)
  })

  it("writes the current schema version", () => {
    saveProgress(EMPTY_PROGRESS)
    const raw = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}")
    expect(raw.version).toBe(SCHEMA_VERSION)
  })

  it("clamps out-of-range answer values during sanitization", () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        version: SCHEMA_VERSION,
        currentMathQuestion: -5,
        programmingAnswers: { 11: 99, 12: -3, 13: 2 },
        gkAnswers: {},
        results: [],
        totalScore: -10,
        earnedAchievements: ["not_a_real_badge", "math_whiz"],
        active: {},
      }),
    )
    const loaded = loadProgress()
    expect(loaded.currentMathQuestion).toBe(0)
    expect(loaded.totalScore).toBe(0)
    // 99 and -3 are out of the valid [-1,3] window and dropped; 2 kept.
    expect(loaded.programmingAnswers).toEqual({ 13: 2 })
    expect(loaded.earnedAchievements).toEqual(["math_whiz"])
  })

  it("clears progress on reset", () => {
    saveProgress({ ...EMPTY_PROGRESS, totalScore: 5 })
    clearProgress()
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull()
  })
})

describe("v1 → v2 migration", () => {
  it("migrates a completed legacy result and preserves the score", () => {
    const legacy = {
      results: [
        {
          section: "mathematics",
          score: 9,
          totalQuestions: 10,
          answers: Array.from({ length: 10 }, (_, i) => ({
            questionId: i + 1,
            selectedAnswer: i === 0 ? 1 : 0,
            isCorrect: i !== 0,
          })),
        },
      ],
      totalScore: 9,
      earnedAchievements: [],
      currentMathQuestion: 10,
      programmingAnswers: {},
      gkAnswers: {},
    }
    const migrated = migrateV1Progress(legacy)
    expect(migrated.results).toHaveLength(1)
    expect(migrated.results[0].section).toBe("mathematics")
    expect(migrated.results[0].score).toBe(9)
    expect(migrated.results[0].mode).toBe("sequential")
    expect(migrated.results[0].difficulty).toBe("all")
  })

  it("reconstructs an in-progress sequential math attempt from a partial legacy run", () => {
    const legacy = {
      results: [{ section: "mathematics", score: 0, totalQuestions: 10, answers: [] }],
      currentMathQuestion: 4,
      programmingAnswers: {},
      gkAnswers: {},
      earnedAchievements: [],
    }
    const migrated = migrateV1Progress(legacy)
    const active = migrated.active.mathematics
    expect(active).toBeDefined()
    expect(active?.config.mode).toBe("sequential")
    expect(active?.config.questionIds).toHaveLength(10)
    expect(active?.currentIndex).toBe(4)
  })

  it("reconstructs in-progress batch attempts from legacy answer maps", () => {
    const legacy = {
      results: [],
      currentMathQuestion: 0,
      programmingAnswers: { 11: 0, 12: 2 },
      gkAnswers: { 21: 1 },
      earnedAchievements: [],
    }
    const migrated = migrateV1Progress(legacy)
    expect(migrated.active.programming?.config.mode).toBe("batch")
    expect(migrated.active.programming?.answers).toEqual({ 11: 0, 12: 2 })
    expect(migrated.active.generalKnowledge?.answers).toEqual({ 21: 1 })
  })

  it("resumes a stored legacy (unversioned) payload via loadProgress", () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        results: [],
        currentMathQuestion: 3,
        programmingAnswers: { 11: 1 },
        gkAnswers: {},
        totalScore: 0,
        earnedAchievements: [],
      }),
    )
    const loaded = loadProgress()
    expect(loaded.active.mathematics?.currentIndex).toBe(3)
    expect(loaded.active.programming?.answers).toEqual({ 11: 1 })
  })

  it("keeps legacy source indices valid so old answers still score correctly", () => {
    // Legacy stored answers as source option indices; migration must not remap them.
    const legacy = {
      results: [],
      currentMathQuestion: 0,
      programmingAnswers: { 11: 3 },
      gkAnswers: {},
      earnedAchievements: [],
    }
    const migrated = migrateV1Progress(legacy)
    expect(migrated.active.programming?.answers[11]).toBe(3)
  })
})

describe("history storage", () => {
  it("round-trips attempts", () => {
    saveHistory([attempt("a", "mathematics", 8, 10)])
    const loaded = loadHistory()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe("a")
  })

  it("caps stored history at 50", () => {
    const many = Array.from({ length: 60 }, (_, i) => attempt(`id-${i}`, "programming", i % 10, 10))
    saveHistory(many)
    expect(loadHistory()).toHaveLength(50)
  })

  it("returns an empty list on corrupt history JSON", () => {
    window.localStorage.setItem(HISTORY_KEY, "][broken")
    expect(loadHistory()).toEqual([])
  })

  it("drops malformed attempt records but keeps valid ones", () => {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({
        version: SCHEMA_VERSION,
        attempts: [
          { id: "good", section: "mathematics", completedAt: "x", correct: 1, total: 2, accuracy: 50, mode: "batch", difficulty: "all", durationMs: null },
          { id: "", section: "mathematics" },
          { section: "not-a-section" },
        ],
      }),
    )
    const loaded = loadHistory()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe("good")
  })

  it("clears history", () => {
    saveHistory([attempt("a", "mathematics", 1, 2)])
    clearHistory()
    expect(loadHistory()).toEqual([])
  })
})

describe("theme storage", () => {
  it("defaults to dark when unset", () => {
    expect(loadTheme()).toBe("dark")
  })

  it("round-trips light", () => {
    saveTheme("light")
    expect(loadTheme()).toBe("light")
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light")
  })
})

describe("export / import", () => {
  it("buildExportBundle produces a bundle that parseImport accepts", () => {
    const progress: QuizProgress = { ...EMPTY_PROGRESS, totalScore: 3 }
    const history = [attempt("h1", "mathematics", 3, 5)]
    const bundle = buildExportBundle(progress, history)
    const result = parseImport(JSON.stringify(bundle))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.progress.totalScore).toBe(3)
      expect(result.history).toHaveLength(1)
    }
  })

  it("rejects invalid JSON with a clear error", () => {
    const result = parseImport("{oops")
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/valid JSON/i)
  })

  it("rejects a well-formed JSON object with the wrong shape", () => {
    const result = parseImport(JSON.stringify({ hello: "world" }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.length).toBeGreaterThan(0)
  })

  it("rejects a bundle with a stale schema version", () => {
    const bundle = { version: 1, exportedAt: "x", progress: {}, history: {} }
    const result = parseImport(JSON.stringify(bundle))
    expect(result.ok).toBe(false)
  })

  it("leaves existing data untouched when import fails", () => {
    saveProgress({ ...EMPTY_PROGRESS, totalScore: 7 })
    const result = parseImport("garbage")
    expect(result.ok).toBe(false)
    // The stored progress is unchanged because parseImport never writes.
    expect(loadProgress().totalScore).toBe(7)
  })
})
