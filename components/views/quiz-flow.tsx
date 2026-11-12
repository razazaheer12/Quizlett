"use client"

import { BatchView } from "@/components/views/batch-view"
import { ResultsView } from "@/components/views/results-view"
import { SequentialView } from "@/components/views/sequential-view"
import { SetupView } from "@/components/views/setup-view"
import { useQuizlett } from "@/hooks/use-quizlett"
import type { SectionId } from "@/lib/types"

/**
 * Routes a section between its setup screen, the active attempt (sequential or
 * batch, per the attempt's own mode), and the results report.
 */
export function QuizFlow({ section }: { section: SectionId }) {
  const { getActive, getResult } = useQuizlett()
  const attempt = getActive(section)

  if (attempt) {
    return attempt.config.mode === "sequential" ? (
      <SequentialView section={section} />
    ) : (
      <BatchView section={section} />
    )
  }
  if (getResult(section)) {
    return <ResultsView section={section} />
  }
  return <SetupView section={section} />
}
