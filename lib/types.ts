export type SectionId = "mathematics" | "programming" | "generalKnowledge"

export type BatchSectionId = Exclude<SectionId, "mathematics">

export type ViewId = "home" | SectionId | "summary" | "history"

export type Difficulty = "easy" | "medium" | "hard"

export type DifficultyFilter = "all" | Difficulty

export type QuizMode = "sequential" | "batch"

/** Question-count choices offered in quiz setup. `"all"` uses every matching question. */
export type QuestionCountChoice = 10 | 15 | "all"

export interface Question {
  id: number
  question: string
  /** Source-order answer options. Display order may be shuffled; selection is stored as a source index. */
  options: string[]
  /** Index into `options` (source order) of the correct answer. Stable across shuffles. */
  correctAnswer: number
  explanation: string
  difficulty: Difficulty
  topic: string
}

export interface UserAnswer {
  questionId: number
  /** Selected option as a SOURCE index (not a display index). -1 means unanswered. */
  selectedAnswer: number
  isCorrect: boolean
}

export interface SectionResult {
  section: SectionId
  score: number
  totalQuestions: number
  answers: UserAnswer[]
  mode: QuizMode
  difficulty: DifficultyFilter
  seed: number
  completedAt: string
}

/** Configuration captured when an attempt starts. Persisted so resume reproduces the same paper. */
export interface QuizConfig {
  section: SectionId
  mode: QuizMode
  count: QuestionCountChoice
  difficulty: DifficultyFilter
  seed: number
  /** Resolved, shuffled question order (source ids) for this attempt. */
  questionIds: number[]
}

export interface MathFeedback {
  selected: number
  correct: boolean
  explanation: string
}

/** Live, in-progress state for the section the user is currently taking. */
export interface ActiveAttempt {
  config: QuizConfig
  /** questionId -> selected SOURCE option index. */
  answers: Record<number, number>
  /** Sequential mode: index into config.questionIds. */
  currentIndex: number
  /** Batch mode: flagged questionIds for review. */
  flags: number[]
  /** ISO timestamp when the attempt started, used to derive duration on completion. */
  startedAt: string
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
  /** Active (unfinished) attempts keyed by section. */
  active: Partial<Record<SectionId, ActiveAttempt>>
}

/** A single completed attempt retained for the History view. Stored separately from progress. */
export interface AttemptRecord {
  id: string
  section: SectionId
  completedAt: string
  correct: number
  total: number
  accuracy: number
  mode: QuizMode
  difficulty: DifficultyFilter
  durationMs: number | null
}

export interface AchievementToast {
  id: AchievementId
  name: string
  description: string
}
