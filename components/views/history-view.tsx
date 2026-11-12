"use client"

import { useState } from "react"
import { ChevronLeft, History, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { accuracyPercent } from "@/lib/insights"
import { SECTION_META } from "@/lib/questions"
import type { AttemptRecord } from "@/lib/types"
import { cn } from "@/lib/utils"

const SECTION_DOT: Record<string, string> = {
  mathematics: "bg-primary",
  programming: "bg-secondary",
  generalKnowledge: "bg-success",
}

function formatDuration(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) return "—"
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${String(seconds).padStart(2, "0")}s` : `${seconds}s`
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

/**
 * Accuracy-over-time chart. Chronological (oldest → newest). Pure SVG so it
 * stays lightweight; the attempt list below carries the accessible detail.
 */
function TrendChart({ attempts }: { attempts: AttemptRecord[] }) {
  const chronological = [...attempts].reverse().slice(-20)
  if (chronological.length < 2) return null

  const width = 100
  const height = 40
  const step = width / (chronological.length - 1)
  const points = chronological.map((a, i) => {
    const x = i * step
    const y = height - (a.accuracy / 100) * height
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const first = chronological[0].accuracy
  const last = chronological[chronological.length - 1].accuracy
  const trend = last > first ? "improving" : last < first ? "declining" : "steady"

  return (
    <section aria-label="Accuracy trend" className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Accuracy trend</h2>
        <span className="text-xs text-muted-foreground">
          last {chronological.length} attempts · {trend}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-28 w-full"
        role="img"
        aria-label={`Line chart of accuracy across your last ${chronological.length} attempts, trending ${trend} from ${first}% to ${last}%.`}
      >
        <line x1="0" y1={height} x2={width} y2={height} className="stroke-border" strokeWidth="0.4" />
        <polyline
          points={points.join(" ")}
          fill="none"
          className="stroke-primary"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {chronological.map((a, i) => {
          const x = i * step
          const y = height - (a.accuracy / 100) * height
          return <circle key={a.id} cx={x} cy={y} r="0.9" className="fill-primary" vectorEffect="non-scaling-stroke" />
        })}
      </svg>
    </section>
  )
}

export function HistoryView() {
  const { history, clearAllHistory, setView } = useQuizlett()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (history.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <p className="eyebrow">Progress</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Attempt history</h1>
        </header>
        <div className="mx-auto max-w-md rounded-xl border border-border/60 bg-card/60 p-8 text-center">
          <History className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-4 text-sm text-muted-foreground">
            No attempts recorded yet. Complete a section and it will show up here with its score, accuracy, and date.
          </p>
          <Button className="mt-6" onClick={() => setView("home")}>
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  const best = history.reduce((max, a) => Math.max(max, a.accuracy), 0)
  const average = Math.round(history.reduce((sum, a) => sum + a.accuracy, 0) / history.length)

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Progress</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Attempt history</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {history.length} attempt{history.length === 1 ? "" : "s"} · {average}% average · {best}% best
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setView("home")}>
            <ChevronLeft className="h-4 w-4" />
            Home
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Clear history
          </Button>
        </div>
      </header>

      <TrendChart attempts={history} />

      <section aria-label="Attempts">
        <ul className="space-y-3">
          {history.map((attempt) => (
            <li
              key={attempt.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-soft"
            >
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", SECTION_DOT[attempt.section] ?? "bg-muted")} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{SECTION_META[attempt.section].title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(attempt.completedAt)} · {attempt.mode === "sequential" ? "Sequential" : "Batch"} ·{" "}
                  {attempt.difficulty === "all" ? "All difficulties" : attempt.difficulty} ·{" "}
                  {formatDuration(attempt.durationMs)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {attempt.correct}/{attempt.total}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">{accuracyPercent(attempt.correct, attempt.total)}%</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear attempt history?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all {history.length} recorded attempts and the trend chart. Your current progress,
              results, and achievements are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearAllHistory()
                setConfirmOpen(false)
              }}
            >
              Clear history
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
