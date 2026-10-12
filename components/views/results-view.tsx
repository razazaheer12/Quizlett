"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft } from "lucide-react"

import { ScoreRing } from "@/components/score-ring"
import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { sectionInsight } from "@/lib/insights"
import { QUESTIONS, SECTION_META, SECTION_ORDER } from "@/lib/questions"
import type { SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

const LETTERS = ["A", "B", "C", "D"]

export function ResultsView({ section }: { section: SectionId }) {
  const { getResult, stats, setView } = useQuizlett()
  const [filter, setFilter] = useState<"all" | "incorrect">("all")

  const result = getResult(section)
  if (!result) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-sm text-muted-foreground">No results recorded for this section yet.</p>
        <Button variant="outline" onClick={() => setView("home")}>
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Button>
      </div>
    )
  }

  const questions = QUESTIONS[section]
  const meta = SECTION_META[section]
  const incorrect = result.totalQuestions - result.score
  const accuracy = Math.round((result.score / result.totalQuestions) * 100)
  const reviewed = filter === "all" ? result.answers : result.answers.filter((a) => !a.isCorrect)

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <ScoreRing value={result.score / result.totalQuestions} size={148}>
          <span className="text-3xl font-semibold tabular-nums tracking-tight">{result.score}</span>
          <span className="text-xs text-muted-foreground">/ {result.totalQuestions}</span>
          <span className="mt-1 text-xs tabular-nums text-muted-foreground">{accuracy}%</span>
        </ScoreRing>
        <div className="min-w-0">
          <p className="eyebrow">Quiz complete</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {sectionInsight(section, result.score, result.totalQuestions)}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/70 bg-card py-4 shadow-soft">
        <div className="text-center">
          <p className="text-xl font-semibold tabular-nums text-success">{result.score}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold tabular-nums text-destructive">{incorrect}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Incorrect</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold tabular-nums">{accuracy}%</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Accuracy</p>
        </div>
      </div>

      <section aria-label="Answer review">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Answer review</h2>
          <div className="flex rounded-lg border border-border/70 bg-card p-0.5">
            {(
              [
                { id: "all", label: `All questions (${result.answers.length})` },
                { id: "incorrect", label: `Incorrect (${incorrect})` },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150",
                  filter === option.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {reviewed.length === 0 ? (
          <p className="rounded-xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
            Nothing to review here — no incorrect answers in this section.
          </p>
        ) : (
          <div className="space-y-4">
            {reviewed.map((answer) => {
              const index = questions.findIndex((q) => q.id === answer.questionId)
              const question = questions[index]
              if (!question) return null
              return (
                <article
                  key={answer.questionId}
                  className={cn(
                    "rounded-xl border p-5",
                    answer.isCorrect ? "border-border/60 bg-card/70" : "border-destructive/30 bg-card",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.16em]",
                        answer.isCorrect ? "text-success" : "text-destructive",
                      )}
                    >
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-medium leading-snug sm:text-base">{question.question}</h3>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <p>
                      <span className="text-muted-foreground">Your answer: </span>
                      <span className={answer.isCorrect ? "text-success" : "text-destructive"}>
                        {answer.selectedAnswer >= 0
                          ? `${LETTERS[answer.selectedAnswer]}. ${question.options[answer.selectedAnswer]}`
                          : "Not answered"}
                      </span>
                    </p>
                    {!answer.isCorrect && (
                      <p>
                        <span className="text-muted-foreground">Correct answer: </span>
                        <span className="font-medium text-success">
                          {LETTERS[question.correctAnswer]}. {question.options[question.correctAnswer]}
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="mt-3 border-l-2 border-border/70 pl-3 text-sm leading-relaxed text-muted-foreground">
                    {question.explanation}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setView("home")}>
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Button>
        {stats.completedSections === SECTION_ORDER.length && (
          <Button onClick={() => setView("summary")}>
            View final summary
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
