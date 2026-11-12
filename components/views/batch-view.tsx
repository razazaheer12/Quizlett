"use client"

import { useState } from "react"
import { Flag } from "lucide-react"

import { AnswerGroup } from "@/components/quiz/answer-group"
import { QuestionNavigator } from "@/components/quiz/question-navigator"
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
import { firstUnanswered } from "@/lib/insights"
import { SECTION_META } from "@/lib/questions"
import { displayOptions } from "@/lib/quiz"
import type { SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

export function BatchView({ section }: { section: SectionId }) {
  const { getActive, activeQuestions, setAnswer, toggleFlag, submitAttempt } = useQuizlett()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const attempt = getActive(section)
  if (!attempt) return null

  const questions = activeQuestions(section)
  const answers = attempt.answers
  const flags = attempt.flags
  const meta = SECTION_META[section]
  const total = questions.length
  const answered = questions.filter((q) => answers[q.id] !== undefined).length
  const unanswered = total - answered

  const jumpToFirstUnanswered = () => {
    const index = firstUnanswered(questions, answers)
    if (index === null) return
    document.getElementById(`question-${questions[index].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <p className="eyebrow">{meta.modeLabel}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Work through all {total} questions, flag any for review, then submit once to see your results.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium tabular-nums">
            {answered} / {total} answered
          </p>
          <div
            className="ml-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={answered}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Answered progress"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <QuestionNavigator questions={questions} answers={answers} flags={flags} />

      <div className="space-y-5">
        {questions.map((question, index) => {
          const options = displayOptions(question, attempt.config.seed)
          const flagged = flags.includes(question.id)
          return (
            <section
              key={question.id}
              id={`question-${question.id}`}
              aria-label={`Question ${index + 1}`}
              className="scroll-mt-24 rounded-xl border border-border/70 bg-card p-5 shadow-soft sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-base font-medium leading-snug sm:text-lg">{question.question}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlag(section, question.id)}
                  aria-pressed={flagged}
                  aria-label={flagged ? `Unflag question ${index + 1}` : `Flag question ${index + 1} for review`}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors duration-150",
                    flagged
                      ? "border-warning/50 bg-warning/10 text-warning"
                      : "border-border/70 text-muted-foreground hover:border-warning/40 hover:text-warning",
                  )}
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <AnswerGroup
                  options={options}
                  label={`Answer options for question ${index + 1}`}
                  selectedSource={answers[question.id]}
                  stateFor={(sourceIndex) => (sourceIndex === answers[question.id] ? "selected" : "idle")}
                  onSelect={(sourceIndex) => setAnswer(section, question.id, sourceIndex)}
                />
              </div>
            </section>
          )
        })}
      </div>

      <div className="sticky bottom-4 z-30">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-elevated/95 px-4 py-3 shadow-lift backdrop-blur">
          <p className="text-xs tabular-nums text-muted-foreground">
            {answered} of {total} answered
            {flags.length > 0 ? ` · ${flags.length} flagged` : ""}
            {unanswered > 0 ? ` · ${unanswered} remaining` : " · ready to submit"}
          </p>
          <div className="flex items-center gap-2">
            {unanswered > 0 && (
              <Button variant="ghost" size="sm" onClick={jumpToFirstUnanswered} className="hidden min-h-[44px] sm:inline-flex">
                Jump to unanswered
              </Button>
            )}
            <Button size="sm" className="min-h-[44px]" onClick={() => setConfirmOpen(true)} disabled={answered === 0}>
              Submit quiz
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {unanswered > 0
                ? `You still have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}.`
                : "Ready to submit?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {unanswered > 0
                ? "Unanswered questions are scored as incorrect. Go back to finish them, or submit as-is."
                : `${total} questions · ${answered} answered · ${flags.length} flagged.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{unanswered > 0 ? "Go back" : "Review"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false)
                submitAttempt(section)
              }}
            >
              {unanswered > 0 ? "Submit anyway" : "Submit quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
