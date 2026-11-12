"use client"

import { useState } from "react"
import { ArrowRight, Layers, ListChecks, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import { SECTION_META, sectionQuestionCount } from "@/lib/questions"
import type { SetupChoices } from "@/lib/quiz"
import type { DifficultyFilter, QuestionCountChoice, QuizMode, SectionId } from "@/lib/types"
import { cn } from "@/lib/utils"

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150",
              value === option.value
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SetupView({ section }: { section: SectionId }) {
  const { startAttempt, previewCount, setView } = useQuizlett()
  const meta = SECTION_META[section]
  const total = sectionQuestionCount(section)

  const [mode, setMode] = useState<QuizMode>(meta.mode)
  const [count, setCount] = useState<QuestionCountChoice>(10)
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all")

  const choices: SetupChoices = { mode, count, difficulty }
  const available = previewCount(section, choices)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <button
          type="button"
          onClick={() => setView("home")}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to sections
        </button>
        <p className="eyebrow">{meta.modeLabel}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {total} questions available. Configure your attempt below — or start right away with the defaults.
        </p>
      </header>

      <div className="space-y-6 rounded-xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
        <Segmented<QuizMode>
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "sequential", label: "Sequential · instant feedback" },
            { value: "batch", label: "Batch · submit to score" },
          ]}
        />
        <Segmented<QuestionCountChoice>
          label="Question count"
          value={count}
          onChange={setCount}
          options={[
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: "all", label: `All (${total})` },
          ]}
        />
        <Segmented<DifficultyFilter>
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          options={[
            { value: "all", label: "All" },
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {mode === "sequential" ? <ListChecks className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
          </span>
          <div>
            <p className="font-medium tabular-nums">
              {available} question{available === 1 ? "" : "s"} matched
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <SlidersHorizontal className="h-3 w-3" />
              {difficulty === "all" ? "All difficulties" : `${difficulty} only`} · shuffled order
            </p>
          </div>
        </div>
        <Button
          className="min-h-[44px] w-full sm:w-auto"
          disabled={available === 0}
          onClick={() => startAttempt(section, choices)}
        >
          Start attempt
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {available === 0 && (
        <p className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          No questions match this filter. Try a different difficulty or count.
        </p>
      )}
    </div>
  )
}
