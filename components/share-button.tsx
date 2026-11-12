"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useQuizlett } from "@/hooks/use-quizlett"
import type { SectionId } from "@/lib/types"

export function ShareButton({ section, label = "Copy summary" }: { section?: SectionId; label?: string }) {
  const { copySummary } = useQuizlett()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const ok = await copySummary(section)
    if (ok) {
      setCopied(true)
      toast.success("Summary copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error("Couldn't access the clipboard. Copy manually or check permissions.")
    }
  }

  return (
    <Button variant="outline" className="min-h-[44px]" onClick={onCopy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </Button>
  )
}
