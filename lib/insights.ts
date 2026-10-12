import { SECTION_META, SECTION_ORDER, TOTAL_QUESTIONS } from "./questions"
import type { SectionId, SectionResult } from "./types"

export interface OverallStats {
  completedSections: number
  totalScore: number
  totalQuestions: number
  accuracy: number
}

export function overallStats(results: SectionResult[]): OverallStats {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0)
  return {
    completedSections: results.length,
    totalScore,
    totalQuestions: TOTAL_QUESTIONS,
    accuracy: TOTAL_QUESTIONS === 0 ? 0 : Math.round((totalScore / TOTAL_QUESTIONS) * 100),
  }
}

export function strongestSection(results: SectionResult[]): SectionResult | null {
  if (results.length === 0) return null
  return [...results].sort((a, b) => b.score / b.totalQuestions - a.score / a.totalQuestions)[0]
}

export function needsReviewSection(results: SectionResult[]): SectionResult | null {
  if (results.length === 0) return null
  return [...results].sort((a, b) => a.score / a.totalQuestions - b.score / b.totalQuestions)[0]
}

export type TierTone = "success" | "primary" | "warning" | "muted"

export interface PerformanceTier {
  title: string
  message: string
  tone: TierTone
}

export function performanceTier(totalScore: number): PerformanceTier {
  if (totalScore === TOTAL_QUESTIONS) {
    return {
      title: "Perfect score",
      message: "Outstanding. You answered every question across all three sections correctly.",
      tone: "success",
    }
  }
  if (totalScore >= 24) {
    return {
      title: "Excellent performance",
      message: "Strong knowledge across all areas. A single review pass could close the remaining gaps.",
      tone: "primary",
    }
  }
  if (totalScore >= 18) {
    return {
      title: "Good work",
      message: "Solid understanding overall. Focus on the sections flagged below to push further.",
      tone: "warning",
    }
  }
  return {
    title: "Keep learning",
    message: "A good starting point. Review the explanations below and retake the sections when ready.",
    tone: "muted",
  }
}

export function sectionInsight(section: SectionId, score: number, total: number): string {
  const title = SECTION_META[section].title
  const pct = total === 0 ? 0 : score / total
  if (pct === 1) return `Flawless ${title.toLowerCase()} run — every answer correct.`
  if (pct >= 0.8) return `Strong command of ${title.toLowerCase()}. One more review to reach mastery.`
  if (pct >= 0.6) return `Working knowledge of ${title.toLowerCase()}. Revisit the missed explanations to solidify it.`
  if (pct >= 0.4) return `Mixed results in ${title.toLowerCase()}. The answer review below highlights exactly what to study.`
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
