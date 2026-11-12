import { optionOrder, shuffle } from "./random"
import { QUESTIONS } from "./questions"
import type {
  Difficulty,
  DifficultyFilter,
  Question,
  QuestionCountChoice,
  QuizConfig,
  QuizMode,
  SectionId,
  UserAnswer,
} from "./types"

export interface DisplayOption {
  /** Index into the question's SOURCE options array. Stable identity for answers. */
  sourceIndex: number
  text: string
}

export interface SetupChoices {
  mode: QuizMode
  count: QuestionCountChoice
  difficulty: DifficultyFilter
}

export function filterByDifficulty(questions: readonly Question[], difficulty: DifficultyFilter): Question[] {
  if (difficulty === "all") return questions.slice()
  return questions.filter((q) => q.difficulty === (difficulty as Difficulty))
}

export function resolveCount(available: number, count: QuestionCountChoice): number {
  if (count === "all") return available
  return Math.min(count, available)
}

/**
 * Build a fully-resolved attempt configuration: filter by difficulty, shuffle the
 * pool with the seed, then slice to the requested count. The resolved `questionIds`
 * are persisted so a resumed attempt shows the exact same paper.
 *
 * Returns `questionIds: []` when a filter matches nothing — callers render an empty state.
 */
export function buildQuizConfig(section: SectionId, choices: SetupChoices, seed: number): QuizConfig {
  const pool = filterByDifficulty(QUESTIONS[section], choices.difficulty)
  const shuffledIds = shuffle(
    pool.map((q) => q.id),
    seed,
  )
  const take = resolveCount(shuffledIds.length, choices.count)
  return {
    section,
    mode: choices.mode,
    count: choices.count,
    difficulty: choices.difficulty,
    seed,
    questionIds: shuffledIds.slice(0, take),
  }
}

export function getQuestionsByIds(section: SectionId, ids: readonly number[]): Question[] {
  const byId = new Map(QUESTIONS[section].map((q) => [q.id, q]))
  const out: Question[] = []
  for (const id of ids) {
    const q = byId.get(id)
    if (q) out.push(q)
  }
  return out
}

export function getQuestion(section: SectionId, id: number): Question | undefined {
  return QUESTIONS[section].find((q) => q.id === id)
}

/** Display order for a question's options, deterministic for (seed, questionId). */
export function displayOptions(question: Question, seed: number): DisplayOption[] {
  return optionOrder(question.options.length, seed, question.id).map((sourceIndex) => ({
    sourceIndex,
    text: question.options[sourceIndex],
  }))
}

export interface ScoredAttempt {
  score: number
  total: number
  answers: UserAnswer[]
}

/**
 * Score an attempt. `answers` maps questionId -> SOURCE option index; questions not
 * present are treated as unanswered (-1). Correctness compares source indices, so it
 * is independent of any display shuffling.
 */
export function scoreAttempt(questions: readonly Question[], answers: Record<number, number>): ScoredAttempt {
  const answerList: UserAnswer[] = questions.map((q) => {
    const selected = answers[q.id] ?? -1
    return { questionId: q.id, selectedAnswer: selected, isCorrect: selected === q.correctAnswer }
  })
  return {
    score: answerList.filter((a) => a.isCorrect).length,
    total: questions.length,
    answers: answerList,
  }
}
