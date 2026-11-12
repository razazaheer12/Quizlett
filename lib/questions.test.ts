import { describe, expect, it } from "vitest"

import { QUESTIONS, SECTION_META, SECTION_ORDER, TOTAL_QUESTIONS, sectionQuestionCount } from "./questions"
import { questionSchema, sectionMetaSchema, validateQuestionBank } from "./schemas"

describe("question bank integrity", () => {
  it("passes full-bank validation", () => {
    expect(validateQuestionBank()).toBe(true)
  })

  it("has 45 questions total, 15 per section", () => {
    expect(TOTAL_QUESTIONS).toBe(45)
    for (const section of SECTION_ORDER) {
      expect(sectionQuestionCount(section)).toBe(15)
      expect(QUESTIONS[section]).toHaveLength(15)
    }
  })

  it("has globally unique ids", () => {
    const ids = SECTION_ORDER.flatMap((section) => QUESTIONS[section].map((q) => q.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("every question matches the schema (4 options, valid correctAnswer, difficulty, topic)", () => {
    for (const section of SECTION_ORDER) {
      for (const question of QUESTIONS[section]) {
        const parsed = questionSchema.safeParse(question)
        expect(parsed.success, `question ${question.id}: ${parsed.success ? "" : parsed.error.message}`).toBe(true)
        expect(question.options).toHaveLength(4)
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
        expect(question.correctAnswer).toBeLessThan(4)
        expect(["easy", "medium", "hard"]).toContain(question.difficulty)
        expect(question.topic.length).toBeGreaterThan(0)
        expect(question.explanation.length).toBeGreaterThan(0)
      }
    }
  })

  it("has no duplicate question text within a section", () => {
    for (const section of SECTION_ORDER) {
      const texts = QUESTIONS[section].map((q) => q.question.trim().toLowerCase())
      expect(new Set(texts).size).toBe(texts.length)
    }
  })

  it("covers the expected topic spread per section", () => {
    const topics = (section: (typeof SECTION_ORDER)[number]) =>
      new Set(QUESTIONS[section].map((q) => q.topic))
    expect(topics("mathematics").size).toBeGreaterThanOrEqual(4)
    expect(topics("programming").size).toBeGreaterThanOrEqual(4)
    expect(topics("generalKnowledge").size).toBeGreaterThanOrEqual(4)
  })
})

describe("section metadata", () => {
  it("matches the schema for every section", () => {
    for (const section of SECTION_ORDER) {
      expect(sectionMetaSchema.safeParse(SECTION_META[section]).success).toBe(true)
    }
  })

  it("preserves the original default modes (math sequential, others batch)", () => {
    expect(SECTION_META.mathematics.mode).toBe("sequential")
    expect(SECTION_META.programming.mode).toBe("batch")
    expect(SECTION_META.generalKnowledge.mode).toBe("batch")
  })

  it("does not hardcode a question count in the mode label", () => {
    for (const section of SECTION_ORDER) {
      expect(SECTION_META[section].modeLabel).not.toMatch(/10 questions/)
    }
  })
})
