"use client"

import { useEffect } from "react"
import { Trophy } from "lucide-react"

import { useQuizlett } from "@/hooks/use-quizlett"
import type { AchievementToast as Toast } from "@/lib/types"

function ToastCard({ toast }: { toast: Toast }) {
  const { dismissToast } = useQuizlett()

  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(toast.id), 2600)
    return () => window.clearTimeout(timer)
  }, [toast.id, dismissToast])

  return (
    <div
      role="status"
      className="animate-toast-in pointer-events-auto flex w-[min(92vw,22rem)] items-center gap-3 rounded-lg border border-border/70 bg-elevated/95 px-4 py-3 shadow-lift backdrop-blur"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
        <Trophy className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Achievement unlocked
        </span>
        <span className="block truncate text-sm font-semibold">{toast.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{toast.description}</span>
      </span>
    </div>
  )
}

export function AchievementToasts() {
  const { toasts } = useQuizlett()
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed left-1/2 top-16 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
