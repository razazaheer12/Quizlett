"use client"

import { useEffect } from "react"
import { ArrowRight, Check, ChevronLeft, X } from "lucide-react"

import { AnswerOption, type OptionState } from "@/components/quiz/answer-option"
import { ResultsView } from "@/components/views/results-view"
import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { QUESTIONS, QUESTIONS_PER_SECTION } from "@/lib/questions"

const LETTERS = ["A", "B", "C", "D"]

export function MathView() {
  const { mathIndex, mathFeedback, answerMath, advanceMath, getResult, setView } = useQuizlett()
  const question = QUESTIONS.mathematics[mathIndex]
  const result = getResult("mathematics")

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (mathFeedback) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          advanceMath()
        }
        return
      }
      const letterIndex = LETTERS.indexOf(event.key.toUpperCase())
      const digitIndex = ["1", "2", "3", "4"].indexOf(event.key)
      const index = letterIndex >= 0 ? letterIndex : digitIndex
      if (index >= 0) answerMath(index)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mathFeedback, answerMath, advanceMath])

  const complete = (result?.answers.length ?? 0) === QUESTIONS_PER_SECTION
  if (complete || !question) {
    return <ResultsView section="mathematics" />
  }

  const answeredCount = mathIndex + (mathFeedback ? 1 : 0)
  const isLast = mathIndex === QUESTIONS.mathematics.length - 1

  const optionState = (index: number): OptionState => {
    if (!mathFeedback) return "idle"
    if (index === question.correctAnswer) return "correct"
    if (index === mathFeedback.selected) return "incorrect"
    return "dimmed"
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2 px-2 text-muted-foreground" onClick={() => setView("home")}>
            <ChevronLeft className="h-4 w-4" />
            Home
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            Question {mathIndex + 1} of {QUESTIONS_PER_SECTION}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${(answeredCount / QUESTIONS_PER_SECTION) * 100}%` }}
          />
        </div>
      </div>

      <div key={question.id} className="animate-fade-up space-y-6">
        <div>
          <p className="text-xs font-semibold tabular-nums text-primary">
            {String(mathIndex + 1).padStart(2, "0")}
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            {question.question}
          </h1>
        </div>

        <div className="space-y-2.5" role="group" aria-label="Answer options">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              letter={LETTERS[index]}
              text={option}
              state={optionState(index)}
              disabled={Boolean(mathFeedback)}
              onClick={() => answerMath(index)}
            />
          ))}
        </div>

        {mathFeedback ? (
          <div className="animate-fade-up space-y-4">
            <div
              className={cnFeedback(mathFeedback.correct)}
              role="status"
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    mathFeedback.correct
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success"
                      : "flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-destructive"
                  }
                >
                  {mathFeedback.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <h2 className="text-sm font-semibold">
                  {mathFeedback.correct ? "Correct — nice work." : "Not quite."}
                </h2>
              </div>
              {!mathFeedback.correct && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="font-medium text-success">
                    {LETTERS[question.correctAnswer]}. {question.options[question.correctAnswer]}
                  </span>
                </p>
              )}
              <p className="mt-3 border-t border-border/50 pt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Explanation · </span>
                {mathFeedback.explanation}
              </p>
            </div>

            <Button className="w-full sm:w-auto" onClick={advanceMath}>
              {isLast ? "Complete section" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function cnFeedback(correct: boolean): string {
  return correct
    ? "rounded-xl border border-success/40 bg-success/10 p-5"
    : "rounded-xl border border-destructive/40 bg-destructive/10 p-5"
}
