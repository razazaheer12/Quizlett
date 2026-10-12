"use client"

import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

export type OptionState = "idle" | "selected" | "correct" | "incorrect" | "dimmed"

interface AnswerOptionProps {
  letter: string
  text: string
  state?: OptionState
  disabled?: boolean
  onClick?: () => void
  id?: string
}

const STATE_CLASSES: Record<OptionState, string> = {
  idle: "border-border/70 bg-card hover:border-primary/45 hover:bg-surface",
  selected: "border-primary/60 bg-primary/10",
  correct: "border-success/50 bg-success/10",
  incorrect: "border-destructive/50 bg-destructive/10",
  dimmed: "border-border/50 bg-card opacity-60",
}

const CHIP_CLASSES: Record<OptionState, string> = {
  idle: "border-border/70 bg-surface text-muted-foreground group-hover:border-primary/45 group-hover:text-primary",
  selected: "border-primary bg-primary text-primary-foreground",
  correct: "border-success bg-success text-white",
  incorrect: "border-destructive bg-destructive text-white",
  dimmed: "border-border/60 bg-surface text-muted-foreground",
}

export function AnswerOption({ letter, text, state = "idle", disabled, onClick, id }: AnswerOptionProps) {
  const revealed = state === "correct" || state === "incorrect"
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={state === "selected"}
      className={cn(
        "group flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-150",
        "disabled:cursor-not-allowed",
        STATE_CLASSES[state],
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold transition-colors duration-150",
          CHIP_CLASSES[state],
        )}
        aria-hidden="true"
      >
        {letter}
      </span>
      <span className="flex-1 text-sm leading-relaxed sm:text-[15px]">{text}</span>
      {revealed ? (
        state === "correct" ? (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-label="Correct answer" />
        ) : (
          <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-label="Incorrect answer" />
        )
      ) : null}
    </button>
  )
}
