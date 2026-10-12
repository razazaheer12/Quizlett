"use client"

import { useState } from "react"
import { Moon, RotateCcw, Settings2, Sun } from "lucide-react"

import { AchievementToasts } from "@/components/achievement-toast"
import { BrandMark } from "@/components/brand-mark"
import { ResetDialog } from "@/components/reset-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuizlett } from "@/hooks/use-quizlett"

export function AppShell({ hint, children }: { hint?: string; children: React.ReactNode }) {
  const { setView, theme, toggleTheme, hasProgress } = useQuizlett()
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-2.5 rounded-md py-1 pr-2 transition-opacity hover:opacity-80"
            aria-label="Quizlett — go to home"
          >
            <BrandMark size={26} />
            <span className="text-[15px] font-semibold tracking-tight">Quizlett</span>
          </button>

          <div className="flex items-center gap-2">
            {hint ? (
              <span className="mr-1 hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
                {hint}
              </span>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  disabled={!hasProgress}
                  onSelect={() => setResetOpen(true)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset progress
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
        <p className="text-xs text-muted-foreground">
          Quizlett · local-first practice — your progress never leaves this browser.
        </p>
      </footer>

      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />

      <AchievementToasts />
    </div>
  )
}
