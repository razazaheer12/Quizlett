"use client"

import { useState } from "react"

import { QuestionNavigator } from "@/components/quiz/question-navigator"
import { AnswerOption } from "@/components/quiz/answer-option"
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
import { ResultsView } from "@/components/views/results-view"
import { useQuizlett } from "@/hooks/use-quizlett"
import { firstUnanswered } from "@/lib/insights"
import { QUESTIONS, QUESTIONS_PER_SECTION, SECTION_META } from "@/lib/questions"
import type { BatchSectionId } from "@/lib/types"

const LETTERS = ["A", "B", "C", "D"]

export function BatchView({ section }: { section: BatchSectionId }) {
  const { batchAnswers, setBatchAnswer, submitBatch, getResult } = useQuizlett()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const questions = QUESTIONS[section]
  const answers = batchAnswers[section]
  const result = getResult(section)
  const meta = SECTION_META[section]

  if (result) {
    return <ResultsView section={section} />
  }

  const answered = Object.keys(answers).length
  const unanswered = questions.length - answered

  const jumpToFirstUnanswered = () => {
    const index = firstUnanswered(questions, answers)
    if (index === null) return
    document.getElementById(`question-${questions[index].id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <p className="eyebrow">{meta.modeLabel}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Work through all {QUESTIONS_PER_SECTION} questions, then submit once to see your results.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium tabular-nums">
            {answered} / {QUESTIONS_PER_SECTION} answered
          </p>
          <div className="ml-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${(answered / QUESTIONS_PER_SECTION) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <QuestionNavigator questions={questions} answers={answers} />

      <div className="space-y-5">
        {questions.map((question, index) => (
          <section
            key={question.id}
            id={`question-${question.id}`}
            aria-label={`Question ${index + 1}`}
            className="scroll-mt-24 rounded-xl border border-border/70 bg-card p-5 shadow-soft sm:p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-base font-medium leading-snug sm:text-lg">{question.question}</h2>
            </div>
            <div className="mt-4 space-y-2.5" role="group" aria-label={`Answer options for question ${index + 1}`}>
              {question.options.map((option, optionIndex) => (
                <AnswerOption
                  key={optionIndex}
                  letter={LETTERS[optionIndex]}
                  text={option}
                  state={answers[question.id] === optionIndex ? "selected" : "idle"}
                  onClick={() => setBatchAnswer(section, question.id, optionIndex)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-4 z-30">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-elevated/95 px-4 py-3 shadow-lift backdrop-blur">
          <p className="text-xs tabular-nums text-muted-foreground">
            {answered} of {QUESTIONS_PER_SECTION} answered
            {unanswered > 0 ? ` · ${unanswered} remaining` : " · ready to submit"}
          </p>
          <div className="flex items-center gap-2">
            {unanswered > 0 && (
              <Button variant="ghost" size="sm" onClick={jumpToFirstUnanswered} className="hidden sm:inline-flex">
                Jump to unanswered
              </Button>
            )}
            <Button size="sm" onClick={() => setConfirmOpen(true)} disabled={answered === 0}>
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
                : `${QUESTIONS_PER_SECTION} questions · ${answered} answered · ${unanswered} unanswered.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{unanswered > 0 ? "Go back" : "Review"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false)
                submitBatch(section)
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
