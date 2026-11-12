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
import { accuracyPercent, overallStats, performanceTier, type OverallStats } from "@/lib/insights"
import { QUESTIONS, SECTION_META } from "@/lib/questions"
import {
  buildQuizConfig,
  filterByDifficulty,
  getQuestionsByIds,
  resolveCount,
  scoreAttempt,
  type SetupChoices,
} from "@/lib/quiz"
import { createSeed } from "@/lib/random"
import { validateQuestionBank } from "@/lib/schemas"
import {
  buildExportBundle,
  clearHistory,
  clearProgress,
  loadHistory,
  loadProgress,
  loadTheme,
  parseImport,
  saveHistory,
  saveProgress,
  saveTheme,
  type ImportResult,
  type Theme,
} from "@/lib/storage"
import type {
  ActiveAttempt,
  AchievementId,
  AchievementToast,
  AttemptRecord,
  MathFeedback,
  Question,
  QuizProgress,
  SectionId,
  SectionResult,
  ViewId,
} from "@/lib/types"

export const LIVE_URL = "https://quizlett-mcqs.vercel.app/"

interface QuizlettContextValue {
  view: ViewId
  setView: (view: ViewId) => void
  theme: Theme
  toggleTheme: () => void

  active: Partial<Record<SectionId, ActiveAttempt>>
  getActive: (section: SectionId) => ActiveAttempt | undefined
  activeQuestions: (section: SectionId) => Question[]
  previewCount: (section: SectionId, choices: SetupChoices) => number
  startAttempt: (section: SectionId, choices: SetupChoices) => boolean
  submitAttempt: (section: SectionId) => void
  retryIncorrect: (section: SectionId) => boolean

  feedback: Partial<Record<SectionId, MathFeedback>>
  answerCurrent: (section: SectionId, sourceIndex: number) => void
  advance: (section: SectionId) => void
  setAnswer: (section: SectionId, questionId: number, sourceIndex: number) => void
  toggleFlag: (section: SectionId, questionId: number) => void

  results: SectionResult[]
  getResult: (section: SectionId) => SectionResult | undefined
  earned: AchievementId[]
  stats: OverallStats
  hasProgress: boolean
  reset: () => void

  history: AttemptRecord[]
  clearAllHistory: () => void

  downloadExport: () => void
  importProgress: (json: string) => ImportResult

  copySummary: (section?: SectionId) => Promise<boolean>

  toasts: AchievementToast[]
  dismissToast: (id: AchievementId) => void
}

const QuizlettContext = createContext<QuizlettContextValue | undefined>(undefined)

function omitSection<T>(record: Partial<Record<SectionId, T>>, section: SectionId): Partial<Record<SectionId, T>> {
  const next = { ...record }
  delete next[section]
  return next
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.opacity = "0"
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export function QuizlettProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewId>("home")
  const [theme, setTheme] = useState<Theme>("dark")

  const [active, setActive] = useState<Partial<Record<SectionId, ActiveAttempt>>>({})
  const [results, setResults] = useState<SectionResult[]>([])
  const [earned, setEarned] = useState<AchievementId[]>([])
  const [history, setHistory] = useState<AttemptRecord[]>([])
  const [toasts, setToasts] = useState<AchievementToast[]>([])
  const [feedback, setFeedback] = useState<Partial<Record<SectionId, MathFeedback>>>({})

  const loaded = useRef(false)

  useLayoutEffect(() => {
    const stored = loadTheme()
    setTheme(stored)
    document.documentElement.classList.toggle("dark", stored === "dark")
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      try {
        validateQuestionBank()
      } catch (error) {
        console.error("[Quizlett] Question bank validation failed:", error)
      }
    }
    const progress = loadProgress()
    setActive(progress.active)
    setResults(progress.results)
    setEarned(progress.earnedAchievements)
    setHistory(loadHistory())
    loaded.current = true
  }, [])

  const stats = useMemo(() => overallStats(results), [results])

  const progressSnapshot = useMemo<QuizProgress>(
    () => ({
      currentMathQuestion: active.mathematics?.currentIndex ?? 0,
      programmingAnswers: active.programming?.answers ?? {},
      gkAnswers: active.generalKnowledge?.answers ?? {},
      results,
      totalScore: stats.totalScore,
      earnedAchievements: earned,
      active,
    }),
    [active, results, stats.totalScore, earned],
  )

  useEffect(() => {
    if (!loaded.current) return
    saveProgress(progressSnapshot)
  }, [progressSnapshot])

  useEffect(() => {
    if (!loaded.current) return
    saveHistory(history)
  }, [history])

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

  const getActive = useCallback((section: SectionId) => active[section], [active])

  const activeQuestions = useCallback(
    (section: SectionId): Question[] => {
      const attempt = active[section]
      if (!attempt) return []
      return getQuestionsByIds(section, attempt.config.questionIds)
    },
    [active],
  )

  const previewCount = useCallback(
    (section: SectionId, choices: SetupChoices): number =>
      resolveCount(filterByDifficulty(QUESTIONS[section], choices.difficulty).length, choices.count),
    [],
  )

  const upsertResult = useCallback((result: SectionResult) => {
    setResults((current) => [...current.filter((r) => r.section !== result.section), result])
  }, [])

  const finalize = useCallback(
    (section: SectionId, attempt: ActiveAttempt) => {
      const questions = getQuestionsByIds(section, attempt.config.questionIds)
      const scored = scoreAttempt(questions, attempt.answers)
      const completedAt = new Date().toISOString()

      upsertResult({
        section,
        score: scored.score,
        totalQuestions: scored.total,
        answers: scored.answers,
        mode: attempt.config.mode,
        difficulty: attempt.config.difficulty,
        seed: attempt.config.seed,
        completedAt,
      })

      const started = Date.parse(attempt.startedAt)
      setHistory((current) =>
        [
          {
            id: `${section}-${attempt.config.seed}-${completedAt}`,
            section,
            completedAt,
            correct: scored.score,
            total: scored.total,
            accuracy: accuracyPercent(scored.score, scored.total),
            mode: attempt.config.mode,
            difficulty: attempt.config.difficulty,
            durationMs: Number.isFinite(started) ? Math.max(0, Date.now() - started) : null,
          } satisfies AttemptRecord,
          ...current,
        ].slice(0, 50),
      )

      setActive((current) => omitSection(current, section))
      setFeedback((current) => omitSection(current, section))
    },
    [upsertResult],
  )

  const startAttempt = useCallback((section: SectionId, choices: SetupChoices): boolean => {
    const config = buildQuizConfig(section, choices, createSeed())
    if (config.questionIds.length === 0) return false
    setActive((current) => ({
      ...current,
      [section]: { config, answers: {}, currentIndex: 0, flags: [], startedAt: new Date().toISOString() },
    }))
    setFeedback((current) => omitSection(current, section))
    setView(section)
    return true
  }, [])

  const answerCurrent = useCallback(
    (section: SectionId, sourceIndex: number) => {
      const attempt = active[section]
      if (!attempt || attempt.config.mode !== "sequential" || feedback[section]) return
      const question = getQuestionsByIds(section, attempt.config.questionIds)[attempt.currentIndex]
      if (!question) return
      setFeedback((current) => ({
        ...current,
        [section]: {
          selected: sourceIndex,
          correct: sourceIndex === question.correctAnswer,
          explanation: question.explanation,
        },
      }))
      setActive((current) => {
        const existing = current[section]
        if (!existing) return current
        return {
          ...current,
          [section]: { ...existing, answers: { ...existing.answers, [question.id]: sourceIndex } },
        }
      })
    },
    [active, feedback],
  )

  const advance = useCallback(
    (section: SectionId) => {
      const attempt = active[section]
      if (!attempt || !feedback[section]) return
      if (attempt.currentIndex < attempt.config.questionIds.length - 1) {
        setFeedback((current) => omitSection(current, section))
        setActive((current) => {
          const existing = current[section]
          if (!existing) return current
          return { ...current, [section]: { ...existing, currentIndex: existing.currentIndex + 1 } }
        })
      } else {
        finalize(section, attempt)
      }
    },
    [active, feedback, finalize],
  )

  const setAnswer = useCallback((section: SectionId, questionId: number, sourceIndex: number) => {
    setActive((current) => {
      const existing = current[section]
      if (!existing) return current
      return { ...current, [section]: { ...existing, answers: { ...existing.answers, [questionId]: sourceIndex } } }
    })
  }, [])

  const toggleFlag = useCallback((section: SectionId, questionId: number) => {
    setActive((current) => {
      const existing = current[section]
      if (!existing) return current
      const flagged = existing.flags.includes(questionId)
      return {
        ...current,
        [section]: {
          ...existing,
          flags: flagged ? existing.flags.filter((id) => id !== questionId) : [...existing.flags, questionId],
        },
      }
    })
  }, [])

  const submitAttempt = useCallback(
    (section: SectionId) => {
      const attempt = active[section]
      if (attempt) finalize(section, attempt)
    },
    [active, finalize],
  )

  const retryIncorrect = useCallback(
    (section: SectionId): boolean => {
      const result = results.find((r) => r.section === section)
      if (!result) return false
      const incorrectIds = result.answers.filter((a) => !a.isCorrect).map((a) => a.questionId)
      if (incorrectIds.length === 0) return false
      setActive((current) => ({
        ...current,
        [section]: {
          config: {
            section,
            mode: result.mode,
            count: "all",
            difficulty: result.difficulty,
            seed: createSeed(),
            questionIds: incorrectIds,
          },
          answers: {},
          currentIndex: 0,
          flags: [],
          startedAt: new Date().toISOString(),
        },
      }))
      setFeedback((current) => omitSection(current, section))
      setView(section)
      return true
    },
    [results],
  )

  const getResult = useCallback((section: SectionId) => results.find((r) => r.section === section), [results])

  const reset = useCallback(() => {
    clearProgress()
    setView("home")
    setActive({})
    setResults([])
    setEarned([])
    setToasts([])
    setFeedback({})
  }, [])

  const clearAllHistory = useCallback(() => {
    clearHistory()
    setHistory([])
  }, [])

  const downloadExport = useCallback(() => {
    const bundle = buildExportBundle(progressSnapshot, history)
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `quizlett-progress-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }, [progressSnapshot, history])

  const importProgress = useCallback((json: string): ImportResult => {
    const result = parseImport(json)
    if (!result.ok) return result
    setActive(result.progress.active)
    setResults(result.progress.results)
    setEarned(result.progress.earnedAchievements)
    setHistory(result.history)
    return result
  }, [])

  const copySummary = useCallback(
    async (section?: SectionId): Promise<boolean> => {
      let text: string
      if (section) {
        const result = results.find((r) => r.section === section)
        if (!result) return false
        const tier = performanceTier(result.score, result.totalQuestions)
        text = `Quizlett — ${SECTION_META[section].title}\nScore: ${result.score}/${result.totalQuestions} (${accuracyPercent(
          result.score,
          result.totalQuestions,
        )}%)\n${tier.title}\nPlay: ${LIVE_URL}`
      } else {
        const tier = performanceTier(stats.totalScore, stats.totalQuestions)
        text = `Quizlett — Final summary\nScore: ${stats.totalScore}/${stats.totalQuestions} (${stats.accuracy}%)\n${tier.title}\nPlay: ${LIVE_URL}`
      }
      return writeClipboard(text)
    },
    [results, stats],
  )

  const dismissToast = useCallback((id: AchievementId) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const hasProgress =
    results.length > 0 ||
    Object.values(active).some(
      (attempt) => attempt !== undefined && (Object.keys(attempt.answers).length > 0 || attempt.currentIndex > 0),
    )

  const value: QuizlettContextValue = {
    view,
    setView,
    theme,
    toggleTheme,
    active,
    getActive,
    activeQuestions,
    previewCount,
    startAttempt,
    submitAttempt,
    retryIncorrect,
    feedback,
    answerCurrent,
    advance,
    setAnswer,
    toggleFlag,
    results,
    getResult,
    earned,
    stats,
    hasProgress,
    reset,
    history,
    clearAllHistory,
    downloadExport,
    importProgress,
    copySummary,
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
