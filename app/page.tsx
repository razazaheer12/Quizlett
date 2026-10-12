"use client"

import { useEffect } from "react"

import { AppShell } from "@/components/app-shell"
import { BatchView } from "@/components/views/batch-view"
import { HomeView } from "@/components/views/home-view"
import { MathView } from "@/components/views/math-view"
import { SummaryView } from "@/components/views/summary-view"
import { QuizlettProvider, useQuizlett } from "@/hooks/use-quizlett"

function Router() {
  const { view, mathFeedback } = useQuizlett()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [view])

  const hint =
    view === "mathematics"
      ? mathFeedback
        ? "Enter to continue"
        : "A–D to answer · Enter to continue"
      : undefined

  return (
    <AppShell hint={hint}>
      {view === "home" && <HomeView />}
      {view === "mathematics" && <MathView />}
      {view === "programming" && <BatchView section="programming" />}
      {view === "generalKnowledge" && <BatchView section="generalKnowledge" />}
      {view === "summary" && <SummaryView />}
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
