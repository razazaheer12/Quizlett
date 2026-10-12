import { QUESTIONS, QUESTIONS_PER_SECTION, SECTION_ORDER } from "./questions"
import type { AchievementId, QuizProgress, SectionId, SectionResult } from "./types"

const PROGRESS_KEY = "quizProgress"
const THEME_KEY = "theme"

export type Theme = "dark" | "light"

export const EMPTY_PROGRESS: QuizProgress = {
  currentMathQuestion: 0,
  programmingAnswers: {},
  gkAnswers: {},
  results: [],
  totalScore: 0,
  earnedAchievements: [],
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function asRecord(value: unknown): Record<number, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {}
  const out: Record<number, number> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const id = Number(key)
    if (Number.isInteger(id) && typeof val === "number" && val >= 0 && val < 4) out[id] = val
  }
  return out
}

function asResults(value: unknown): SectionResult[] {
  if (!Array.isArray(value)) return []
  const out: SectionResult[] = []
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue
    const raw = entry as Record<string, unknown>
    const section = raw.section as SectionId
    if (!SECTION_ORDER.includes(section)) continue
    const answers = Array.isArray(raw.answers)
      ? raw.answers
          .filter((a): a is Record<string, unknown> => typeof a === "object" && a !== null)
          .map((a) => ({
            questionId: asNumber(a.questionId, -1),
            selectedAnswer: asNumber(a.selectedAnswer, -1),
            isCorrect: Boolean(a.isCorrect),
          }))
          .filter((a) => a.questionId > 0)
      : []
    out.push({
      section,
      score: asNumber(raw.score, answers.filter((a) => a.isCorrect).length),
      totalQuestions: asNumber(raw.totalQuestions, QUESTIONS_PER_SECTION),
      answers,
    })
  }
  return out
}

function asAchievements(value: unknown): AchievementId[] {
  if (!Array.isArray(value)) return []
  const known: AchievementId[] = ["math_whiz", "code_master", "knowledge_guru", "quiz_master", "perfectionist"]
  return value.filter((id): id is AchievementId => typeof id === "string" && known.includes(id as AchievementId))
}

export function loadProgress(): QuizProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const results = asResults(parsed.results)
    return {
      currentMathQuestion: Math.min(
        Math.max(0, Math.floor(asNumber(parsed.currentMathQuestion, 0))),
        results.some((r) => r.section === "mathematics") ? QUESTIONS_PER_SECTION : QUESTIONS.mathematics.length - 1,
      ),
      programmingAnswers: asRecord(parsed.programmingAnswers),
      gkAnswers: asRecord(parsed.gkAnswers),
      results,
      totalScore: asNumber(parsed.totalScore, results.reduce((sum, r) => sum + r.score, 0)),
      earnedAchievements: asAchievements(parsed.earnedAchievements),
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: QuizProgress): void {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // storage unavailable (private mode) — quiz keeps working in-memory
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(PROGRESS_KEY)
  } catch {
    // ignore
  }
}

export function loadTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

export function saveTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore
  }
}
