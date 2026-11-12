import { SECTION_META, SECTION_ORDER } from "./questions"
import type { SectionId, SectionResult } from "./types"

export interface OverallStats {
  completedSections: number
  totalScore: number
  totalQuestions: number
  accuracy: number
}

export function accuracyPercent(score: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((score / total) * 100)
}

/**
 * Overall stats across completed section results. Totals are derived from the
 * actual attempts (variable length), never a fixed question count.
 */
export function overallStats(results: SectionResult[]): OverallStats {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0)
  const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0)
  return {
    completedSections: results.length,
    totalScore,
    totalQuestions,
    accuracy: accuracyPercent(totalScore, totalQuestions),
  }
}

export function strongestSection(results: SectionResult[]): SectionResult | null {
  if (results.length === 0) return null
  return [...results].sort(
    (a, b) => b.score / Math.max(1, b.totalQuestions) - a.score / Math.max(1, a.totalQuestions),
  )[0]
}

export function needsReviewSection(results: SectionResult[]): SectionResult | null {
  if (results.length === 0) return null
  return [...results].sort(
    (a, b) => a.score / Math.max(1, a.totalQuestions) - b.score / Math.max(1, b.totalQuestions),
  )[0]
}

export type TierTone = "success" | "primary" | "warning" | "muted"

export interface PerformanceTier {
  title: string
  message: string
  tone: TierTone
}

/**
 * Percentage-based performance tier, independent of quiz length.
 * Perfect = 100%, Excellent ≥ 80%, Good ≥ 60%, otherwise Keep learning.
 */
export function performanceTier(score: number, total: number): PerformanceTier {
  if (total <= 0) {
    return {
      title: "Keep learning",
      message: "Answer some questions to see how you're doing.",
      tone: "muted",
    }
  }
  const pct = (score / total) * 100
  if (pct >= 100) {
    return {
      title: "Perfect score",
      message: "Outstanding. You answered every question correctly.",
      tone: "success",
    }
  }
  if (pct >= 80) {
    return {
      title: "Excellent performance",
      message: "Strong knowledge across the board. A single review pass could close the remaining gaps.",
      tone: "primary",
    }
  }
  if (pct >= 60) {
    return {
      title: "Good work",
      message: "Solid understanding overall. Focus on the questions flagged below to push further.",
      tone: "warning",
    }
  }
  return {
    title: "Keep learning",
    message: "A good starting point. Review the explanations below and retake when ready.",
    tone: "muted",
  }
}

export function sectionInsight(section: SectionId, score: number, total: number): string {
  const title = SECTION_META[section].title
  const pct = total === 0 ? 0 : score / total
  if (pct === 1) return `Flawless ${title.toLowerCase()} run — every answer correct.`
  if (pct >= 0.8) return `Strong command of ${title.toLowerCase()}. One more review to reach mastery.`
  if (pct >= 0.6) return `Working knowledge of ${title.toLowerCase()}. Revisit the missed explanations to solidify it.`
  if (pct >= 0.4)
    return `Mixed results in ${title.toLowerCase()}. The answer review below highlights exactly what to study.`
  return `${title} needs attention. Work through the explanations below, then retake the section.`
}

export function sectionTitle(section: SectionId): string {
  return SECTION_META[section].title
}

export function answeredCount(answers: Record<number, number>): number {
  return Object.keys(answers).length
}

export function firstUnanswered(questions: { id: number }[], answers: Record<number, number>): number | null {
  const index = questions.findIndex((q) => answers[q.id] === undefined)
  return index === -1 ? null : index
}

export { SECTION_ORDER }
