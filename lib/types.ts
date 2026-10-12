export type SectionId = "mathematics" | "programming" | "generalKnowledge"

export type BatchSectionId = Exclude<SectionId, "mathematics">

export type ViewId = "home" | SectionId | "summary"

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface UserAnswer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

export interface SectionResult {
  section: SectionId
  score: number
  totalQuestions: number
  answers: UserAnswer[]
}

export type AchievementId =
  | "math_whiz"
  | "code_master"
  | "knowledge_guru"
  | "quiz_master"
  | "perfectionist"

export interface QuizProgress {
  currentMathQuestion: number
  programmingAnswers: Record<number, number>
  gkAnswers: Record<number, number>
  results: SectionResult[]
  totalScore: number
  earnedAchievements: AchievementId[]
}

export interface MathFeedback {
  selected: number
  correct: boolean
  explanation: string
}

export interface AchievementToast {
  id: AchievementId
  name: string
  description: string
}
