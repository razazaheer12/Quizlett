import { SECTION_ORDER, TOTAL_QUESTIONS } from "./questions"
import type { AchievementId, SectionResult } from "./types"

export interface AchievementDefinition {
  id: AchievementId
  name: string
  description: string
  requirement: string
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "math_whiz",
    name: "Math Whiz",
    description: "Score 10/10 in Mathematics",
    requirement: "10/10 Mathematics",
  },
  {
    id: "code_master",
    name: "Code Master",
    description: "Score 10/10 in Programming",
    requirement: "10/10 Programming",
  },
  {
    id: "knowledge_guru",
    name: "Knowledge Guru",
    description: "Score 10/10 in General Knowledge",
    requirement: "10/10 General Knowledge",
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Complete all sections",
    requirement: "All 3 sections",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score 30/30 overall",
    requirement: "30/30 overall",
  },
]

const SECTION_ACHIEVEMENT: Record<string, AchievementId> = {
  mathematics: "math_whiz",
  programming: "code_master",
  generalKnowledge: "knowledge_guru",
}

export function computeEarned(results: SectionResult[]): AchievementId[] {
  const earned: AchievementId[] = []

  for (const result of results) {
    if (result.score === result.totalQuestions) {
      const id = SECTION_ACHIEVEMENT[result.section]
      if (id && !earned.includes(id)) earned.push(id)
    }
  }

  const completedAll = SECTION_ORDER.every((section) => results.some((r) => r.section === section))
  if (completedAll && !earned.includes("quiz_master")) earned.push("quiz_master")

  const total = results.reduce((sum, result) => sum + result.score, 0)
  if (total === TOTAL_QUESTIONS && !earned.includes("perfectionist")) earned.push("perfectionist")

  return ACHIEVEMENTS.filter((a) => earned.includes(a.id)).map((a) => a.id)
}
