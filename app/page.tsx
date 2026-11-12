"use client"

import { useEffect } from "react"

import { AppShell } from "@/components/app-shell"
import { HomeView } from "@/components/views/home-view"
import { HistoryView } from "@/components/views/history-view"
import { QuizFlow } from "@/components/views/quiz-flow"
import { SummaryView } from "@/components/views/summary-view"
import { QuizlettProvider, useQuizlett } from "@/hooks/use-quizlett"
import { SECTION_ORDER } from "@/lib/questions"
import type { SectionId } from "@/lib/types"

const SECTIONS = SECTION_ORDER as readonly SectionId[]

function Router() {
  const { view, getActive, feedback, active } = useQuizlett()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [view])

  const isSection = (v: string): v is SectionId => (SECTIONS as readonly string[]).includes(v)
  const activeSection = isSection(view) ? view : undefined
  const attempt = activeSection ? getActive(activeSection) : undefined

  // Warn before leaving only when there is meaningful unsaved batch progress.
  useEffect(() => {
    const hasUnsavedBatch = Object.values(active).some(
      (a) => a !== undefined && a.config.mode === "batch" && Object.keys(a.answers).length > 0,
    )
    if (!hasUnsavedBatch) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [active])

  let hint: string | undefined
  if (activeSection && attempt?.config.mode === "sequential") {
    hint = feedback[activeSection] ? "Enter to continue" : "A–D to answer · Enter to continue"
  }

  return (
    <AppShell hint={hint}>
      {view === "home" && <HomeView />}
      {activeSection && <QuizFlow section={activeSection} />}
      {view === "summary" && <SummaryView />}
      {view === "history" && <HistoryView />}
    </AppShell>
  )
}

export default function Page() {
  return (
    <QuizlettProvider>
      <Router />
    </QuizlettProvider>
  )
}
