"use client"

import { useState } from "react"
import { BookOpen, Brain, ChevronLeft, Code, RotateCcw, TrendingUp, Trophy } from "lucide-react"

import { ResetDialog } from "@/components/reset-dialog"
import { ScoreRing } from "@/components/score-ring"
import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { ACHIEVEMENTS } from "@/lib/achievements"
import {
  needsReviewSection,
  performanceTier,
  sectionTitle,
  strongestSection,
  type TierTone,
} from "@/lib/insights"
import { QUESTIONS_PER_SECTION, SECTION_META, SECTION_ORDER } from "@/lib/questions"
import type { SectionId } from "@/lib/types"
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

const TIER_TONE: Record<TierTone, string> = {
  success: "border-success/40 bg-success/10 text-success",
  primary: "border-primary/40 bg-primary/10 text-primary",
  warning: "border-warning/40 bg-warning/10 text-warning",
  muted: "border-border/70 bg-card text-foreground",
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function SummaryView() {
  const { stats, results, getResult, earned, setView } = useQuizlett()
  const [resetOpen, setResetOpen] = useState(false)

  const tier = performanceTier(stats.totalScore)
  const strongest = strongestSection(results)
  const weakest = needsReviewSection(results)
  const earnedDefs = ACHIEVEMENTS.filter((a) => earned.includes(a.id))

  return (
    <div className="space-y-10">
      <header className="text-center">
        <p className="eyebrow">All sections complete</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Final summary</h1>
      </header>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <ScoreRing value={stats.totalQuestions === 0 ? 0 : stats.totalScore / stats.totalQuestions} size={190} stroke={12}>
          <span className="text-4xl font-semibold tabular-nums tracking-tight">{stats.totalScore}</span>
          <span className="text-xs text-muted-foreground">/ {stats.totalQuestions}</span>
          <span className="mt-1 text-sm tabular-nums text-muted-foreground">{stats.accuracy}%</span>
        </ScoreRing>
      </div>

      <div className={cn("rounded-xl border p-5 text-center shadow-soft", TIER_TONE[tier.tone])}>
        <h2 className="text-lg font-semibold tracking-tight">{tier.title}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed opacity-90">{tier.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Strongest section
          </div>
          <p className="mt-3 text-xl font-semibold tracking-tight">
            {strongest ? sectionTitle(strongest.section) : "—"}
          </p>
          {strongest && (
            <p className="mt-1 text-sm text-muted-foreground">
              {strongest.score}/{strongest.totalQuestions} correct ·{" "}
              {Math.round((strongest.score / strongest.totalQuestions) * 100)}%
            </p>
          )}
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Brain className="h-3.5 w-3.5" />
            Needs review
          </div>
          <p className="mt-3 text-xl font-semibold tracking-tight">
            {weakest ? sectionTitle(weakest.section) : "—"}
          </p>
          {weakest && (
            <p className="mt-1 text-sm text-muted-foreground">
              {weakest.score}/{weakest.totalQuestions} correct ·{" "}
              {Math.round((weakest.score / weakest.totalQuestions) * 100)}%
            </p>
          )}
        </div>
      </div>

      <section aria-label="Section breakdown">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Section breakdown
        </h2>
        <div className="space-y-3">
          {SECTION_ORDER.map((section) => {
            const result = getResult(section)
            const score = result?.score ?? 0
            const Icon = SECTION_ICON[section]
            return (
              <div
                key={section}
                className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-soft"
              >
                <span
                  className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", SECTION_ACCENT[section])}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium">{SECTION_META[section].title}</p>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {result ? `${score}/${QUESTIONS_PER_SECTION}` : "—"}
                    </span>
                  </div>
                  <Bar value={(score / QUESTIONS_PER_SECTION) * 100} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-label="Achievements earned">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Achievements earned</h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {earned.length} / {ACHIEVEMENTS.length}
          </span>
        </div>
        {earnedDefs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {earnedDefs.map((achievement) => (
              <span
                key={achievement.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                <Trophy className="h-3.5 w-3.5" />
                {achievement.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
            No achievements unlocked yet. Score perfectly in a section — or across all three — to earn badges.
          </p>
        )}
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => setView("home")}>
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Button>
        <Button onClick={() => setResetOpen(true)}>
          <RotateCcw className="h-4 w-4" />
          Take quiz again
        </Button>
      </div>

      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />
    </div>
  )
}
