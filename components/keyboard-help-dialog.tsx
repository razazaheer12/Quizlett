"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const SHORTCUTS: { keys: string[]; description: string }[] = [
  { keys: ["A", "B", "C", "D"], description: "Select an answer (sequential mode)" },
  { keys: ["1", "2", "3", "4"], description: "Select an answer by position (sequential mode)" },
  { keys: ["Enter"], description: "Continue to the next question after answering" },
  { keys: ["?"], description: "Open this keyboard help" },
  { keys: ["Esc"], description: "Close a dialog" },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-border/70 bg-surface px-1.5 font-sans text-xs font-semibold text-foreground shadow-sm">
      {children}
    </kbd>
  )
}

interface KeyboardHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardHelpDialog({ open, onOpenChange }: KeyboardHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Shortcuts are disabled while typing in a text field. Answer keys apply to the sequential quiz mode.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-2 space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.description} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
