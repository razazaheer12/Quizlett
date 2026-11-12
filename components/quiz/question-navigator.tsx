"use client"

import { Check, Flag } from "lucide-react"

import type { Question } from "@/lib/types"
import { cn } from "@/lib/utils"

interface QuestionNavigatorProps {
  questions: Question[]
  answers: Record<number, number>
  flags?: number[]
}

export function QuestionNavigator({ questions, answers, flags = [] }: QuestionNavigatorProps) {
  const jump = (question: Question) => {
    const element = document.getElementById(`question-${question.id}`)
    element?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav
      aria-label="Question navigator"
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {questions.map((question, index) => {
        const answered = answers[question.id] !== undefined
        const flagged = flags.includes(question.id)
        const label = `Question ${index + 1}: ${answered ? "answered" : "unanswered"}${flagged ? ", flagged" : ""}`
        return (
          <button
            key={question.id}
            type="button"
            onClick={() => jump(question)}
            aria-label={label}
            aria-current={flagged ? "true" : undefined}
            className={cn(
              "flex h-9 min-w-[2.25rem] items-center justify-center gap-1 rounded-md border px-1.5 text-xs font-medium tabular-nums transition-colors duration-150",
              answered
                ? "border-primary/45 bg-primary/10 text-primary"
                : "border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              flagged && "ring-1 ring-warning/60",
            )}
          >
            {String(index + 1).padStart(2, "0")}
            {flagged ? (
              <Flag className="h-3 w-3 text-warning" aria-hidden="true" />
            ) : answered ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
