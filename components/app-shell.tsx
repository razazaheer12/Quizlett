"use client"

import { useEffect, useState } from "react"
import { Download, History, Keyboard, Moon, RotateCcw, Settings2, Sun, Upload } from "lucide-react"
import { Toaster } from "sonner"

import { AchievementToasts } from "@/components/achievement-toast"
import { BrandMark } from "@/components/brand-mark"
import { ExportDialog, ImportDialog } from "@/components/data-dialog"
import { KeyboardHelpDialog } from "@/components/keyboard-help-dialog"
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

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

export function AppShell({ hint, children }: { hint?: string; children: React.ReactNode }) {
  const { setView, theme, toggleTheme, hasProgress } = useQuizlett()
  const [resetOpen, setResetOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "?" || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      setHelpOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

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

          <div className="flex items-center gap-1 sm:gap-2">
            {hint ? (
              <span className="mr-1 hidden items-center gap-1.5 text-[11px] text-muted-foreground md:flex">
                {hint}
              </span>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setHelpOpen(true)}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setView("history")}>
                  <History className="mr-2 h-4 w-4" />
                  Attempt history
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setExportOpen(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setImportOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setHelpOpen(true)}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard shortcuts
                </DropdownMenuItem>
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
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <KeyboardHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />

      <AchievementToasts />
      <Toaster theme={theme} position="bottom-center" richColors />
    </div>
  )
}
