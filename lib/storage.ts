import { QUESTIONS, SECTION_META, SECTION_ORDER } from "./questions"
import { SCHEMA_VERSION, exportBundleSchema, type ExportBundle } from "./schemas"
import type {
  AchievementId,
  ActiveAttempt,
  AttemptRecord,
  DifficultyFilter,
  QuizMode,
  QuizProgress,
  SectionId,
  SectionResult,
  UserAnswer,
} from "./types"

const PROGRESS_KEY = "quizProgress"
const THEME_KEY = "theme"
const HISTORY_KEY = "quizHistory"
const HISTORY_LIMIT = 50

export type Theme = "dark" | "light"

export type PersistedProgress = QuizProgress & { version: number }

const KNOWN_ACHIEVEMENTS: AchievementId[] = [
  "math_whiz",
  "code_master",
  "knowledge_guru",
  "quiz_master",
  "perfectionist",
]

/** Legacy (v1) section order: the first 10 question ids per section, in source order. */
function legacyQuestionIds(section: SectionId): number[] {
  return QUESTIONS[section]
    .slice(0, 10)
    .map((q) => q.id)
}

export const EMPTY_PROGRESS: QuizProgress = {
  currentMathQuestion: 0,
  programmingAnswers: {},
  gkAnswers: {},
  results: [],
  totalScore: 0,
  earnedAchievements: [],
  active: {},
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function asIntRecord(value: unknown): Record<number, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {}
  const out: Record<number, number> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const id = Number(key)
    if (Number.isInteger(id) && typeof val === "number" && val >= -1 && val < 4) out[id] = val
  }
  return out
}

function asAnswers(value: unknown): UserAnswer[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((a): a is Record<string, unknown> => typeof a === "object" && a !== null)
    .map((a) => ({
      questionId: asNumber(a.questionId, -1),
      selectedAnswer: asNumber(a.selectedAnswer, -1),
      isCorrect: Boolean(a.isCorrect),
    }))
    .filter((a) => a.questionId > 0)
}

function asAchievements(value: unknown): AchievementId[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (id): id is AchievementId => typeof id === "string" && KNOWN_ACHIEVEMENTS.includes(id as AchievementId),
  )
}

function asSectionId(value: unknown): SectionId | null {
  return typeof value === "string" && (SECTION_ORDER as string[]).includes(value) ? (value as SectionId) : null
}

function asMode(value: unknown, fallback: QuizMode): QuizMode {
  return value === "sequential" || value === "batch" ? value : fallback
}

function asDifficultyFilter(value: unknown, fallback: DifficultyFilter = "all"): DifficultyFilter {
  return value === "all" || value === "easy" || value === "medium" || value === "hard" ? value : fallback
}

function sanitizeResult(raw: Record<string, unknown>, section: SectionId): SectionResult {
  const answers = asAnswers(raw.answers)
  const totalQuestions = Math.max(0, Math.floor(asNumber(raw.totalQuestions, answers.length)))
  const score = Math.min(
    totalQuestions,
    Math.max(0, Math.floor(asNumber(raw.score, answers.filter((a) => a.isCorrect).length))),
  )
  return {
    section,
    score,
    totalQuestions,
    answers,
    mode: asMode(raw.mode, SECTION_META[section].mode),
    difficulty: asDifficultyFilter(raw.difficulty),
    seed: Math.max(0, Math.floor(asNumber(raw.seed, 0))),
    completedAt: typeof raw.completedAt === "string" ? raw.completedAt : new Date().toISOString(),
  }
}

function sanitizeResults(value: unknown): SectionResult[] {
  if (!Array.isArray(value)) return []
  const out: SectionResult[] = []
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue
    const raw = entry as Record<string, unknown>
    const section = asSectionId(raw.section)
    if (!section) continue
    out.push(sanitizeResult(raw, section))
  }
  return out
}

function sanitizeActiveAttempt(raw: unknown, section: SectionId): ActiveAttempt | null {
  if (typeof raw !== "object" || raw === null) return null
  const a = raw as Record<string, unknown>
  const cfg = (typeof a.config === "object" && a.config !== null ? a.config : {}) as Record<string, unknown>
  const questionIds = Array.isArray(cfg.questionIds)
    ? cfg.questionIds.filter((n): n is number => typeof n === "number" && Number.isInteger(n) && n > 0)
    : legacyQuestionIds(section)
  if (questionIds.length === 0) return null
  const answers = asIntRecord(a.answers)
  const flags = Array.isArray(a.flags)
    ? a.flags.filter((n): n is number => typeof n === "number" && Number.isInteger(n) && n > 0)
    : []
  return {
    config: {
      section,
      mode: asMode(cfg.mode, SECTION_META[section].mode),
      count: cfg.count === 15 || cfg.count === "all" ? cfg.count : 10,
      difficulty: asDifficultyFilter(cfg.difficulty),
      seed: Math.max(0, Math.floor(asNumber(cfg.seed, 0))),
      questionIds,
    },
    answers,
    currentIndex: Math.min(
      Math.max(0, Math.floor(asNumber(a.currentIndex, 0))),
      Math.max(0, questionIds.length - 1),
    ),
    flags,
    startedAt: typeof a.startedAt === "string" ? a.startedAt : new Date().toISOString(),
  }
}

function sanitizeActive(value: unknown): Partial<Record<SectionId, ActiveAttempt>> {
  const out: Partial<Record<SectionId, ActiveAttempt>> = {}
  if (typeof value !== "object" || value === null) return out
  for (const section of SECTION_ORDER) {
    const attempt = sanitizeActiveAttempt((value as Record<string, unknown>)[section], section)
    if (attempt) out[section] = attempt
  }
  return out
}

/** Tolerantly sanitize a v2-shaped progress object (clamps out-of-range values). */
function sanitizeProgressV2(raw: Record<string, unknown>): QuizProgress {
  const results = sanitizeResults(raw.results)
  const active = sanitizeActive(raw.active)
  return {
    currentMathQuestion: Math.max(0, Math.floor(asNumber(raw.currentMathQuestion, 0))),
    programmingAnswers: asIntRecord(raw.programmingAnswers),
    gkAnswers: asIntRecord(raw.gkAnswers),
    results,
    totalScore: Math.max(0, Math.floor(asNumber(raw.totalScore, results.reduce((s, r) => s + r.score, 0)))),
    earnedAchievements: asAchievements(raw.earnedAchievements),
    active,
  }
}

/**
 * Migrate a legacy (v1, unversioned) progress object to the current shape.
 * Preserves completed results, earned achievements, and in-progress attempts so an
 * existing user can resume exactly where they left off.
 */
export function migrateV1Progress(raw: Record<string, unknown>): QuizProgress {
  const migratedAt = new Date().toISOString()
  const results: SectionResult[] = []
  const active: Partial<Record<SectionId, ActiveAttempt>> = {}

  const legacyResults = Array.isArray(raw.results) ? (raw.results as Record<string, unknown>[]) : []
  // Partial (incomplete) legacy math answers, captured so an unfinished run can resume.
  let partialMathAnswers: Record<number, number> = {}
  for (const entry of legacyResults) {
    if (typeof entry !== "object" || entry === null) continue
    const section = asSectionId(entry.section)
    if (!section) continue
    const answers = asAnswers(entry.answers)
    const total = Math.max(0, Math.floor(asNumber(entry.totalQuestions, 10)))
    // A legacy attempt counts as completed when every question was answered.
    if (answers.length >= total && total > 0) {
      results.push({
        section,
        score: Math.min(total, Math.max(0, Math.floor(asNumber(entry.score, answers.filter((a) => a.isCorrect).length)))),
        totalQuestions: total,
        answers,
        mode: SECTION_META[section].mode,
        difficulty: "all",
        seed: 0,
        completedAt: migratedAt,
      })
    } else if (section === "mathematics") {
      const answerMap: Record<number, number> = {}
      for (const a of answers) answerMap[a.questionId] = a.selectedAnswer
      partialMathAnswers = answerMap
    }
  }

  // Reconstruct an in-progress sequential math attempt when it wasn't completed.
  // Handles both the "partial result entry" case and the legacy shape where an
  // unfinished run stored only `currentMathQuestion` with no result entry at all.
  const mathCompleted = results.some((r) => r.section === "mathematics")
  const mathIndex = Math.max(0, Math.floor(asNumber(raw.currentMathQuestion, 0)))
  if (!mathCompleted && (mathIndex > 0 || Object.keys(partialMathAnswers).length > 0)) {
    const ids = legacyQuestionIds("mathematics")
    active.mathematics = {
      config: {
        section: "mathematics",
        mode: "sequential",
        count: 10,
        difficulty: "all",
        seed: 0,
        questionIds: ids,
      },
      answers: partialMathAnswers,
      currentIndex: Math.min(mathIndex, ids.length - 1),
      flags: [],
      startedAt: migratedAt,
    }
  }

  // Legacy batch sections stored answers as Record<qid, optionIndex>.
  const progAnswers = asIntRecord(raw.programmingAnswers)
  if (Object.keys(progAnswers).length > 0 && !results.some((r) => r.section === "programming")) {
    active.programming = {
      config: {
        section: "programming",
        mode: "batch",
        count: 10,
        difficulty: "all",
        seed: 0,
        questionIds: legacyQuestionIds("programming"),
      },
      answers: progAnswers,
      currentIndex: 0,
      flags: [],
      startedAt: migratedAt,
    }
  }

  const gkAnswers = asIntRecord(raw.gkAnswers)
  if (Object.keys(gkAnswers).length > 0 && !results.some((r) => r.section === "generalKnowledge")) {
    active.generalKnowledge = {
      config: {
        section: "generalKnowledge",
        mode: "batch",
        count: 10,
        difficulty: "all",
        seed: 0,
        questionIds: legacyQuestionIds("generalKnowledge"),
      },
      answers: gkAnswers,
      currentIndex: 0,
      flags: [],
      startedAt: migratedAt,
    }
  }

  return {
    currentMathQuestion: Math.max(0, Math.floor(asNumber(raw.currentMathQuestion, 0))),
    programmingAnswers: progAnswers,
    gkAnswers,
    results,
    totalScore: Math.max(0, Math.floor(asNumber(raw.totalScore, results.reduce((s, r) => s + r.score, 0)))),
    earnedAchievements: asAchievements(raw.earnedAchievements),
    active,
  }
}

export function loadProgress(): QuizProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (typeof parsed !== "object" || parsed === null) return EMPTY_PROGRESS
    if (parsed.version === SCHEMA_VERSION) return sanitizeProgressV2(parsed)
    return migrateV1Progress(parsed)
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: QuizProgress): void {
  try {
    const persisted: PersistedProgress = { version: SCHEMA_VERSION, ...progress }
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(persisted))
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

function sanitizeAttemptRecord(raw: unknown): AttemptRecord | null {
  if (typeof raw !== "object" || raw === null) return null
  const a = raw as Record<string, unknown>
  const section = asSectionId(a.section)
  const id = typeof a.id === "string" && a.id.length > 0 ? a.id : null
  if (!section || !id) return null
  const total = Math.max(1, Math.floor(asNumber(a.total, 0)))
  const correct = Math.min(total, Math.max(0, Math.floor(asNumber(a.correct, 0))))
  return {
    id,
    section,
    completedAt: typeof a.completedAt === "string" ? a.completedAt : new Date().toISOString(),
    correct,
    total,
    accuracy: Math.min(100, Math.max(0, asNumber(a.accuracy, Math.round((correct / total) * 100)))),
    mode: asMode(a.mode, SECTION_META[section].mode),
    difficulty: asDifficultyFilter(a.difficulty),
    durationMs:
      typeof a.durationMs === "number" && Number.isFinite(a.durationMs) && a.durationMs >= 0
        ? Math.floor(a.durationMs)
        : null,
  }
}

export function loadHistory(): AttemptRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const attempts = Array.isArray(parsed?.attempts) ? parsed.attempts : []
    const out: AttemptRecord[] = []
    for (const entry of attempts) {
      const record = sanitizeAttemptRecord(entry)
      if (record) out.push(record)
    }
    return out.slice(0, HISTORY_LIMIT)
  } catch {
    return []
  }
}

export function saveHistory(attempts: AttemptRecord[]): void {
  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, attempts: attempts.slice(0, HISTORY_LIMIT) }),
    )
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_KEY)
  } catch {
    // ignore
  }
}

/** Build the downloadable export bundle from current progress + history. */
export function buildExportBundle(progress: QuizProgress, history: AttemptRecord[]): ExportBundle {
  return {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress: { version: SCHEMA_VERSION, ...progress },
    history: { version: SCHEMA_VERSION, attempts: history.slice(0, HISTORY_LIMIT) },
  }
}

export type ImportResult =
  | { ok: true; progress: QuizProgress; history: AttemptRecord[] }
  | { ok: false; error: string }

/**
 * Strictly validate an imported JSON string with Zod, then run it through the
 * tolerant sanitizers. Returns a descriptive error without touching current data
 * when validation fails.
 */
export function parseImport(json: string): ImportResult {
  let rawUnknown: unknown
  try {
    rawUnknown = JSON.parse(json)
  } catch {
    return { ok: false, error: "That file isn't valid JSON." }
  }

  const parsed = exportBundleSchema.safeParse(rawUnknown)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return {
      ok: false,
      error: first ? `Incompatible or malformed file (${first.path.join(".") || "root"}: ${first.message}).` : "Incompatible or malformed file.",
    }
  }

  const bundle = parsed.data
  return {
    ok: true,
    progress: sanitizeProgressV2(bundle.progress as unknown as Record<string, unknown>),
    history: bundle.history.attempts
      .map((a) => sanitizeAttemptRecord(a))
      .filter((a): a is AttemptRecord => a !== null)
      .slice(0, HISTORY_LIMIT),
  }
}
