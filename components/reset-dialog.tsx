"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useQuizlett } from "@/hooks/use-quizlett"

interface ResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetDialog({ open, onOpenChange }: ResetDialogProps) {
  const { reset } = useQuizlett()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove your quiz scores, completion progress, saved answers, and
            unlocked achievements.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
          >
            Reset everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
