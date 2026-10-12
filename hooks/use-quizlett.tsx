"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { ACHIEVEMENTS, computeEarned } from "@/lib/achievements"
import { overallStats, type OverallStats } from "@/lib/insights"
import { QUESTIONS, QUESTIONS_PER_SECTION } from "@/lib/questions"
import {
  clearProgress,
  loadProgress,
  loadTheme,
  saveProgress,
  saveTheme,
  type Theme,
} from "@/lib/storage"
import type {
  AchievementId,
  AchievementToast,
  BatchSectionId,
  MathFeedback,
  SectionId,
  SectionResult,
  UserAnswer,
  ViewId,
} from "@/lib/types"

interface QuizlettContextValue {
  view: ViewId
  setView: (view: ViewId) => void
  theme: Theme
  toggleTheme: () => void

  mathIndex: number
  mathFeedback: MathFeedback | null
  answerMath: (selected: number) => void
  advanceMath: () => void

  batchAnswers: Record<BatchSectionId, Record<number, number>>
  setBatchAnswer: (section: BatchSectionId, questionId: number, option: number) => void
  submitBatch: (section: BatchSectionId) => void

  results: SectionResult[]
  getResult: (section: SectionId) => SectionResult | undefined
  earned: AchievementId[]
  stats: OverallStats
  hasProgress: boolean
  reset: () => void

  toasts: AchievementToast[]
  dismissToast: (id: AchievementId) => void
}

const QuizlettContext = createContext<QuizlettContextValue | undefined>(undefined)

export function QuizlettProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewId>("home")
  const [theme, setTheme] = useState<Theme>("dark")

  const [mathIndex, setMathIndex] = useState(0)
  const [mathFeedback, setMathFeedback] = useState<MathFeedback | null>(null)
  const [batchAnswers, setBatchAnswers] = useState<Record<BatchSectionId, Record<number, number>>>({
    programming: {},
    generalKnowledge: {},
  })
  const [results, setResults] = useState<SectionResult[]>([])
  const [earned, setEarned] = useState<AchievementId[]>([])
  const [toasts, setToasts] = useState<AchievementToast[]>([])

  const loaded = useRef(false)

  // sync state with the theme class applied by the pre-paint script in layout.tsx
  useLayoutEffect(() => {
    const stored = loadTheme()
    setTheme(stored)
    document.documentElement.classList.toggle("dark", stored === "dark")
  }, [])

  // restore persisted progress
  useEffect(() => {
    const progress = loadProgress()
    setMathIndex(progress.currentMathQuestion)
    setBatchAnswers({
      programming: progress.programmingAnswers,
      generalKnowledge: progress.gkAnswers,
    })
    setResults(progress.results)
    setEarned(progress.earnedAchievements)
    loaded.current = true
  }, [])

  const stats = useMemo(() => overallStats(results), [results])

  // persist on every state change (after restore completes)
  useEffect(() => {
    if (!loaded.current) return
    saveProgress({
      currentMathQuestion: mathIndex,
      programmingAnswers: batchAnswers.programming,
      gkAnswers: batchAnswers.generalKnowledge,
      results,
      totalScore: stats.totalScore,
      earnedAchievements: earned,
    })
  }, [mathIndex, batchAnswers, results, stats.totalScore, earned])

  // detect newly earned achievements whenever results change
  useEffect(() => {
    if (!loaded.current) return
    const next = computeEarned(results)
    const newly = next.filter((id) => !earned.includes(id))
    if (newly.length === 0) return
    setEarned(next)
    setToasts((current) => [
      ...current,
      ...newly
        .filter((id) => !current.some((toast) => toast.id === id))
        .map((id) => {
          const definition = ACHIEVEMENTS.find((a) => a.id === id)
          return { id, name: definition?.name ?? id, description: definition?.description ?? "" }
        }),
    ])
  }, [results, earned])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark"
      document.documentElement.classList.toggle("dark", next === "dark")
      saveTheme(next)
      return next
    })
  }, [])

  const upsertResult = useCallback((result: SectionResult) => {
    setResults((current) => [...current.filter((r) => r.section !== result.section), result])
  }, [])

  const answerMath = useCallback(
    (selected: number) => {
      if (mathFeedback) return
      const question = QUESTIONS.mathematics[mathIndex]
      if (!question) return
      const correct = selected === question.correctAnswer

      setMathFeedback({ selected, correct, explanation: question.explanation })

      const previous = results.find((r) => r.section === "mathematics")
      const answers = [...(previous?.answers ?? [])]
      const answer: UserAnswer = { questionId: question.id, selectedAnswer: selected, isCorrect: correct }
      const atIndex = answers.findIndex((a) => a.questionId === question.id)
      if (atIndex >= 0) answers[atIndex] = answer
      else answers.push(answer)

      upsertResult({
        section: "mathematics",
        score: answers.filter((a) => a.isCorrect).length,
        totalQuestions: QUESTIONS_PER_SECTION,
        answers,
      })
    },
    [mathFeedback, mathIndex, results, upsertResult],
  )

  const advanceMath = useCallback(() => {
    if (!mathFeedback) return
    setMathFeedback(null)
    if (mathIndex < QUESTIONS.mathematics.length - 1) {
      setMathIndex(mathIndex + 1)
    } else {
      setView("home")
    }
  }, [mathFeedback, mathIndex])

  const setBatchAnswer = useCallback((section: BatchSectionId, questionId: number, option: number) => {
    setBatchAnswers((current) => ({
      ...current,
      [section]: { ...current[section], [questionId]: option },
    }))
  }, [])

  const submitBatch = useCallback(
    (section: BatchSectionId) => {
      const answers: UserAnswer[] = QUESTIONS[section].map((question) => {
        const selected = batchAnswers[section][question.id] ?? -1
        return { questionId: question.id, selectedAnswer: selected, isCorrect: selected === question.correctAnswer }
      })
      upsertResult({
        section,
        score: answers.filter((a) => a.isCorrect).length,
        totalQuestions: QUESTIONS_PER_SECTION,
        answers,
      })
    },
    [batchAnswers, upsertResult],
  )

  const getResult = useCallback((section: SectionId) => results.find((r) => r.section === section), [results])

  const reset = useCallback(() => {
    clearProgress()
    setView("home")
    setMathIndex(0)
    setMathFeedback(null)
    setBatchAnswers({ programming: {}, generalKnowledge: {} })
    setResults([])
    setEarned([])
    setToasts([])
  }, [])

  const dismissToast = useCallback((id: AchievementId) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const hasProgress =
    results.length > 0 ||
    mathIndex > 0 ||
    Object.keys(batchAnswers.programming).length > 0 ||
    Object.keys(batchAnswers.generalKnowledge).length > 0

  const value: QuizlettContextValue = {
    view,
    setView,
    theme,
    toggleTheme,
    mathIndex,
    mathFeedback,
    answerMath,
    advanceMath,
    batchAnswers,
    setBatchAnswer,
    submitBatch,
    results,
    getResult,
    earned,
    stats,
    hasProgress,
    reset,
    toasts,
    dismissToast,
  }

  return <QuizlettContext.Provider value={value}>{children}</QuizlettContext.Provider>
}

export function useQuizlett(): QuizlettContextValue {
  const context = useContext(QuizlettContext)
  if (context === undefined) {
    throw new Error("useQuizlett must be used within a QuizlettProvider")
  }
  return context
}
