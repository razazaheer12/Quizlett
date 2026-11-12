import { SECTION_ORDER } from "./questions"
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
    description: "Score 100% in a Mathematics attempt",
    requirement: "Perfect Mathematics",
  },
  {
    id: "code_master",
    name: "Code Master",
    description: "Score 100% in a Programming attempt",
    requirement: "Perfect Programming",
  },
  {
    id: "knowledge_guru",
    name: "Knowledge Guru",
    description: "Score 100% in a General Knowledge attempt",
    requirement: "Perfect General Knowledge",
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Complete all three sections",
    requirement: "All 3 sections",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score 100% in every section",
    requirement: "Perfect across all sections",
  },
]

const SECTION_ACHIEVEMENT: Record<string, AchievementId> = {
  mathematics: "math_whiz",
  programming: "code_master",
  generalKnowledge: "knowledge_guru",
}

function isPerfect(result: SectionResult): boolean {
  return result.totalQuestions > 0 && result.score === result.totalQuestions
}

/**
 * Evaluate earned achievements from the latest result per section. Rules are
 * length-agnostic: a "perfect" section is 100% of whatever attempt was taken,
 * so filtered or 15-question attempts are handled correctly.
 */
export function computeEarned(results: SectionResult[]): AchievementId[] {
  const earned: AchievementId[] = []

  for (const result of results) {
    if (isPerfect(result)) {
      const id = SECTION_ACHIEVEMENT[result.section]
      if (id && !earned.includes(id)) earned.push(id)
    }
  }

  const completedAll = SECTION_ORDER.every((section) => results.some((r) => r.section === section))
  if (completedAll) {
    earned.push("quiz_master")
    const allPerfect = SECTION_ORDER.every((section) => {
      const result = results.find((r) => r.section === section)
      return result ? isPerfect(result) : false
    })
    if (allPerfect) earned.push("perfectionist")
  }

  return ACHIEVEMENTS.filter((a) => earned.includes(a.id)).map((a) => a.id)
}
