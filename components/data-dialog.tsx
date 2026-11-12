"use client"

import { useRef, useState } from "react"
import { Download, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useQuizlett } from "@/hooks/use-quizlett"
import { parseImport } from "@/lib/storage"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: DialogProps) {
  const { downloadExport } = useQuizlett()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export progress</DialogTitle>
          <DialogDescription>
            Download a JSON backup of your progress, section results, achievements, settings, and attempt
            history. Keep it safe — you can restore it later with Import.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              downloadExport()
              toast.success("Progress exported")
              onOpenChange(false)
            }}
          >
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ImportStage =
  | { status: "input" }
  | { status: "error"; message: string }
  | {
      status: "preview"
      json: string
      completedSections: number
      totalScore: number
      attempts: number
    }

export function ImportDialog({ open, onOpenChange }: DialogProps) {
  const { importProgress } = useQuizlett()
  const [text, setText] = useState("")
  const [stage, setStage] = useState<ImportStage>({ status: "input" })
  const fileRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setText("")
    setStage({ status: "input" })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetState()
    onOpenChange(next)
  }

  const onFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setText(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => setStage({ status: "error", message: "Couldn't read that file." })
    reader.readAsText(file)
  }

  const validate = () => {
    if (text.trim().length === 0) {
      setStage({ status: "error", message: "Paste your exported JSON or choose a file first." })
      return
    }
    const result = parseImport(text)
    if (!result.ok) {
      setStage({ status: "error", message: result.error })
      return
    }
    setStage({
      status: "preview",
      json: text,
      completedSections: result.progress.results.length,
      totalScore: result.progress.results.reduce((sum, r) => sum + r.score, 0),
      attempts: result.history.length,
    })
  }

  const confirmImport = () => {
    if (stage.status !== "preview") return
    const result = importProgress(stage.json)
    if (!result.ok) {
      setStage({ status: "error", message: result.error })
      return
    }
    toast.success("Progress imported")
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import progress</DialogTitle>
          <DialogDescription>
            Restore a previously exported JSON backup. Your existing data is left untouched until you
            explicitly confirm the replacement below.
          </DialogDescription>
        </DialogHeader>

        {stage.status === "preview" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
              <p className="font-medium text-warning">Replace your current data?</p>
              <p className="mt-1 text-muted-foreground">
                This backup contains {stage.completedSections} completed section
                {stage.completedSections === 1 ? "" : "s"} ({stage.totalScore} correct) and {stage.attempts}{" "}
                history attempt{stage.attempts === 1 ? "" : "s"}. Importing overwrites your current progress,
                results, achievements, and history.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStage({ status: "input" })}>
                Back
              </Button>
              <Button onClick={confirmImport}>
                <Upload className="h-4 w-4" />
                Replace my data
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => onFile(event.target.files?.[0])}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Choose file
              </Button>
              <span className="text-xs text-muted-foreground">or paste JSON below</span>
            </div>
            <Textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                if (stage.status === "error") setStage({ status: "input" })
              }}
              placeholder='{ "version": 2, "progress": { ... }, "history": [ ... ] }'
              rows={7}
              className="font-mono text-xs"
              aria-label="Exported Quizlett JSON"
            />
            {stage.status === "error" && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {stage.message}
              </p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={validate}>Validate &amp; preview</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
