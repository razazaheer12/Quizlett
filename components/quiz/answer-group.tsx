"use client"

import { useRef } from "react"

import { AnswerOption, type OptionState } from "@/components/quiz/answer-option"
import type { DisplayOption } from "@/lib/quiz"

const LETTERS = ["A", "B", "C", "D"]

interface AnswerGroupProps {
  options: DisplayOption[]
  label: string
  selectedSource?: number
  stateFor: (sourceIndex: number) => OptionState
  onSelect: (sourceIndex: number) => void
  disabled?: boolean
  letters?: string[]
}

/**
 * Radio-group answer selector. Implements the WAI-ARIA radiogroup pattern:
 * a single tab stop with roving tabindex, and arrow keys move focus and select.
 */
export function AnswerGroup({
  options,
  label,
  selectedSource,
  stateFor,
  onSelect,
  disabled,
  letters = LETTERS,
}: AnswerGroupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const checkedIndex = options.findIndex((option) => option.sourceIndex === selectedSource)
  const activeIndex = checkedIndex >= 0 ? checkedIndex : 0

  const focusOption = (index: number) => {
    const option = options[index]
    if (!option) return
    onSelect(option.sourceIndex)
    refs.current[index]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return
    const last = options.length - 1
    let next: number | null = null
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = activeIndex >= last ? 0 : activeIndex + 1
        break
      case "ArrowUp":
      case "ArrowLeft":
        next = activeIndex <= 0 ? last : activeIndex - 1
        break
      case "Home":
        next = 0
        break
      case "End":
        next = last
        break
      default:
        return
    }
    event.preventDefault()
    focusOption(next)
  }

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="space-y-2.5">
      {options.map((option, index) => (
        <AnswerOption
          key={option.sourceIndex}
          ref={(node) => {
            refs.current[index] = node
          }}
          radio
          letter={letters[index]}
          text={option.text}
          state={stateFor(option.sourceIndex)}
          checked={option.sourceIndex === selectedSource}
          disabled={disabled}
          tabIndex={index === activeIndex ? 0 : -1}
          onClick={() => onSelect(option.sourceIndex)}
        />
      ))}
    </div>
  )
}
