"use client"

import { ArrowRight, BookOpen, Brain, Check, Code, Lock, Star, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { ACHIEVEMENTS } from "@/lib/achievements"
import { QUESTIONS, QUESTIONS_PER_SECTION, SECTION_META, SECTION_ORDER } from "@/lib/questions"
import type { AchievementId, SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

const SECTION_ICON: Record<SectionId, typeof Brain> = {
  mathematics: Brain,
  programming: Code,
  generalKnowledge: BookOpen,
}

const SECTION_ACCENT: Record<SectionId, string> = {
  mathematics: "bg-primary/10 text-primary",
  programming: "bg-secondary/10 text-secondary",
  generalKnowledge: "bg-success/10 text-success",
}

const ACHIEVEMENT_ICON: Record<AchievementId, typeof Trophy> = {
  math_whiz: Brain,
  code_master: Code,
  knowledge_guru: BookOpen,
  quiz_master: Trophy,
  perfectionist: Star,
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

function ProgressOverview() {
  const { stats, getResult } = useQuizlett()
  return (
    <section
      aria-label="Your progress"
      className="animate-fade-up rounded-xl border border-border/70 bg-card/80 p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Your progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
              {stats.totalScore}
            </span>
            <span className="text-sm text-muted-foreground">/ {stats.totalQuestions} overall</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.accuracy}% accuracy · {stats.completedSections} of {SECTION_ORDER.length} sections completed
          </p>
        </div>
        <div className="grid flex-1 gap-3 lg:max-w-md">
          {SECTION_ORDER.map((section) => {
            const result = getResult(section)
            const score = result?.score ?? 0
            return (
              <div key={section} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-sm text-muted-foreground">
                  {SECTION_META[section].title}
                </span>
                <ProgressBar value={(score / QUESTIONS_PER_SECTION) * 100} />
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {result ? `${score}/10` : "—"}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface ContinueItem {
  section: SectionId
  detail: string
  percent: number
}

function ContinueBanner() {
  const { mathIndex, batchAnswers, getResult, setView } = useQuizlett()

  const items: ContinueItem[] = []
  if (!getResult("mathematics") && mathIndex > 0) {
    items.push({
      section: "mathematics",
      detail: `Question ${mathIndex + 1} of ${QUESTIONS_PER_SECTION}`,
      percent: (mathIndex / QUESTIONS_PER_SECTION) * 100,
    })
  }
  for (const section of ["programming", "generalKnowledge"] as const) {
    const answered = Object.keys(batchAnswers[section]).length
    if (!getResult(section) && answered > 0) {
      items.push({
        section,
        detail: `${answered} of ${QUESTIONS_PER_SECTION} answered`,
        percent: (answered / QUESTIONS_PER_SECTION) * 100,
      })
    }
  }

  if (items.length === 0) return null

  return (
    <section aria-label="Continue where you left off" className="space-y-3">
      {items.map((item) => (
        <div
          key={item.section}
          className="animate-fade-up flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Continue where you left off
            </p>
            <p className="mt-1 truncate text-sm font-medium">
              {SECTION_META[item.section].title} · {item.detail}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressBar value={item.percent} className="w-24 bg-primary/20" />
            <Button size="sm" onClick={() => setView(item.section)}>
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </section>
  )
}

function CategoryCard({ section }: { section: SectionId }) {
  const { getResult, mathIndex, batchAnswers, setView } = useQuizlett()
  const meta = SECTION_META[section]
  const Icon = SECTION_ICON[section]
  const result = getResult(section)

  const inProgressCount =
    section === "mathematics" ? mathIndex : Object.keys(batchAnswers[section as "programming" | "generalKnowledge"]).length
  const started = result ? true : inProgressCount > 0
  const percent = result ? 100 : (inProgressCount / QUESTIONS_PER_SECTION) * 100
  const status = result
    ? `Completed · ${result.score}/10`
    : inProgressCount > 0
      ? `In progress · ${inProgressCount}/10`
      : "Not started"

  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
            SECTION_ACCENT[section],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">{meta.title}</h3>
          <p className="text-xs text-muted-foreground">{meta.modeLabel}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{meta.description}</p>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={cn("tabular-nums", started ? "text-foreground" : "text-muted-foreground")}>{status}</span>
          <span className="tabular-nums text-muted-foreground">{QUESTIONS[section].length} questions</span>
        </div>
        <ProgressBar value={percent} />
      </div>

      <Button
        variant={result ? "outline" : "default"}
        className="w-full group/cta"
        onClick={() => setView(section)}
      >
        {result ? "Review results" : started ? "Continue quiz" : "Start quiz"}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
      </Button>
    </article>
  )
}

function AchievementsPanel() {
  const { earned } = useQuizlett()
  return (
    <section aria-label="Achievements">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Achievements</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {earned.length} / {ACHIEVEMENTS.length} unlocked
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = earned.includes(achievement.id)
          const Icon = ACHIEVEMENT_ICON[achievement.id]
          return (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 transition-colors duration-200",
                unlocked ? "border-primary/35 bg-primary/10 shadow-glow" : "border-border/60 bg-card/60",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-semibold", !unlocked && "text-muted-foreground")}>
                  {achievement.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">{achievement.requirement}</p>
              </div>
              {unlocked ? (
                <Check className="h-4 w-4 shrink-0 text-primary" aria-label="Unlocked" />
              ) : (
                <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-label="Locked" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function HomeView() {
  const { stats, setView } = useQuizlett()
  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="animate-fade-up max-w-2xl">
        <p className="eyebrow">Quizlett</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
          Test what you know.
          <br />
          Discover what you don&apos;t.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Choose a topic, challenge yourself, and track your progress.
        </p>
        {stats.completedSections === SECTION_ORDER.length && (
          <Button className="mt-6" onClick={() => setView("summary")}>
            View final summary
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </section>

      <ProgressOverview />
      <ContinueBanner />

      <section aria-label="Quiz sections">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Sections</h2>
          <span className="text-xs text-muted-foreground">3 topics · 30 questions</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SECTION_ORDER.map((section) => (
            <CategoryCard key={section} section={section} />
          ))}
        </div>
      </section>

      <AchievementsPanel />
    </div>
  )
}
