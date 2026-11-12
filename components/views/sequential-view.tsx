"use client"

import { useEffect } from "react"
import { ArrowRight, Check, ChevronLeft, X } from "lucide-react"

import { AnswerGroup } from "@/components/quiz/answer-group"
import { type OptionState } from "@/components/quiz/answer-option"
import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { displayOptions } from "@/lib/quiz"
import type { SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

const LETTERS = ["A", "B", "C", "D"]

export function SequentialView({ section }: { section: SectionId }) {
  const { getActive, activeQuestions, feedback, answerCurrent, advance, setView } = useQuizlett()
  const attempt = getActive(section)
  const questions = activeQuestions(section)
  const fb = attempt ? feedback[section] : undefined
  const question = attempt ? questions[attempt.currentIndex] : undefined

  useEffect(() => {
    if (!attempt || !question) return
    const options = displayOptions(question, attempt.config.seed)
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (fb) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          advance(section)
        }
        return
      }
      const letterIndex = LETTERS.indexOf(event.key.toUpperCase())
      const digitIndex = ["1", "2", "3", "4"].indexOf(event.key)
      const displayIndex = letterIndex >= 0 ? letterIndex : digitIndex
      if (displayIndex >= 0 && displayIndex < options.length) {
        const option = options[displayIndex]
        if (option) answerCurrent(section, option.sourceIndex)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [attempt, question, fb, advance, answerCurrent, section])

  if (!attempt || !question) return null

  const total = attempt.config.questionIds.length
  const answered = Object.keys(attempt.answers).length
  const isLast = attempt.currentIndex === total - 1
  const options = displayOptions(question, attempt.config.seed)

  const optionState = (sourceIndex: number): OptionState => {
    if (!fb) return "idle"
    if (sourceIndex === question.correctAnswer) return "correct"
    if (sourceIndex === fb.selected) return "incorrect"
    return "dimmed"
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2 min-h-[44px] px-2 text-muted-foreground" onClick={() => setView("home")}>
            <ChevronLeft className="h-4 w-4" />
            Home
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            Question {attempt.currentIndex + 1} of {total}
          </span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Quiz progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>

      <div key={question.id} className="animate-fade-up space-y-6">
        <div>
          <p className="text-xs font-semibold tabular-nums text-primary">
            {String(attempt.currentIndex + 1).padStart(2, "0")}
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{question.question}</h1>
        </div>

        <AnswerGroup
          options={options}
          label="Answer options"
          selectedSource={fb?.selected}
          stateFor={optionState}
          onSelect={(sourceIndex) => answerCurrent(section, sourceIndex)}
          disabled={Boolean(fb)}
        />

        {fb ? (
          <div className="animate-fade-up space-y-4">
            <div
              className={cn(
                "rounded-xl border p-5",
                fb.correct ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    fb.correct ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                  )}
                >
                  {fb.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <h2 className="text-sm font-semibold">{fb.correct ? "Correct — nice work." : "Not quite."}</h2>
              </div>
              {!fb.correct && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="font-medium text-success">{question.options[question.correctAnswer]}</span>
                </p>
              )}
              <p className="mt-3 border-t border-border/50 pt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Explanation · </span>
                {fb.explanation}
              </p>
            </div>

            <Button className="min-h-[44px] w-full sm:w-auto" onClick={() => advance(section)}>
              {isLast ? "Complete section" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
