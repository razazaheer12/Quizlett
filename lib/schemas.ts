import { z } from "zod"

import { QUESTIONS, SECTION_ORDER } from "./questions"

/** Current schema version for persisted and exported data. Bump on breaking shape changes. */
export const SCHEMA_VERSION = 2

export const sectionIdSchema = z.enum(["mathematics", "programming", "generalKnowledge"])
export const difficultySchema = z.enum(["easy", "medium", "hard"])
export const difficultyFilterSchema = z.enum(["all", "easy", "medium", "hard"])
export const quizModeSchema = z.enum(["sequential", "batch"])
export const questionCountSchema = z.union([z.literal(10), z.literal(15), z.literal("all")])

export const questionSchema = z
  .object({
    id: z.number().int().positive(),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).length(4),
    correctAnswer: z.number().int().min(0).max(3),
    explanation: z.string().min(1),
    difficulty: difficultySchema,
    topic: z.string().min(1),
  })
  .superRefine((q, ctx) => {
    if (q.correctAnswer >= q.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "correctAnswer must reference a valid option index",
      })
    }
  })

export const sectionMetaSchema = z.object({
  id: sectionIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  mode: quizModeSchema,
  modeLabel: z.string().min(1),
})

export const userAnswerSchema = z.object({
  questionId: z.number().int(),
  selectedAnswer: z.number().int().min(-1),
  isCorrect: z.boolean(),
})

export const quizConfigSchema = z.object({
  section: sectionIdSchema,
  mode: quizModeSchema,
  count: questionCountSchema,
  difficulty: difficultyFilterSchema,
  seed: z.number().int().nonnegative(),
  questionIds: z.array(z.number().int().positive()),
})

export const sectionResultSchema = z.object({
  section: sectionIdSchema,
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().nonnegative(),
  answers: z.array(userAnswerSchema),
  mode: quizModeSchema,
  difficulty: difficultyFilterSchema,
  seed: z.number().int().nonnegative(),
  completedAt: z.string(),
})

export const activeAttemptSchema = z.object({
  config: quizConfigSchema,
  answers: z.record(z.string(), z.number().int()),
  currentIndex: z.number().int().nonnegative(),
  flags: z.array(z.number().int().positive()),
  startedAt: z.string(),
})

export const achievementIdSchema = z.enum([
  "math_whiz",
  "code_master",
  "knowledge_guru",
  "quiz_master",
  "perfectionist",
])

export const quizProgressSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  currentMathQuestion: z.number().int().nonnegative(),
  programmingAnswers: z.record(z.string(), z.number().int()),
  gkAnswers: z.record(z.string(), z.number().int()),
  results: z.array(sectionResultSchema),
  totalScore: z.number().int().nonnegative(),
  earnedAchievements: z.array(achievementIdSchema),
  active: z.record(sectionIdSchema, activeAttemptSchema),
})

export const attemptRecordSchema = z.object({
  id: z.string().min(1),
  section: sectionIdSchema,
  completedAt: z.string().min(1),
  correct: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  accuracy: z.number().min(0).max(100),
  mode: quizModeSchema,
  difficulty: difficultyFilterSchema,
  durationMs: z.number().int().nonnegative().nullable(),
})

export const historySchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  attempts: z.array(attemptRecordSchema).max(50),
})

/** The downloadable JSON bundle produced by Export and consumed by Import. */
export const exportBundleSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  exportedAt: z.string(),
  progress: quizProgressSchema,
  history: historySchema,
})

export type ExportBundle = z.infer<typeof exportBundleSchema>

/**
 * Development-time validation of the whole question bank. Throws a descriptive
 * error on the first problem so a malformed bank never ships. exercised by tests.
 */
export function validateQuestionBank(): true {
  const seen = new Set<number>()
  for (const section of SECTION_ORDER) {
    const parsed = z.array(questionSchema).safeParse(QUESTIONS[section])
    if (!parsed.success) {
      throw new Error(`Invalid questions in "${section}": ${parsed.error.message}`)
    }
    for (const q of parsed.data) {
      if (seen.has(q.id)) throw new Error(`Duplicate question id ${q.id} in "${section}"`)
      seen.add(q.id)
    }
  }
  return true
}
