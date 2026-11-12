import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AnswerOption } from "./answer-option"

describe("AnswerOption", () => {
  it("renders the letter and text", () => {
    render(<AnswerOption letter="A" text="Paris" />)
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("Paris")).toBeInTheDocument()
  })

  it("reflects selection with aria-pressed in the default (button) mode", () => {
    render(<AnswerOption letter="A" text="Paris" state="selected" />)
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true")
  })

  it("uses radio semantics when radio is set", () => {
    render(<AnswerOption letter="A" text="Paris" radio checked />)
    const radio = screen.getByRole("radio")
    expect(radio).toHaveAttribute("aria-checked", "true")
    expect(radio).not.toHaveAttribute("aria-pressed")
  })

  it("reveals a correct marker for the correct state", () => {
    render(<AnswerOption letter="A" text="Paris" state="correct" />)
    expect(screen.getByLabelText("Correct answer")).toBeInTheDocument()
  })

  it("reveals an incorrect marker for the incorrect state", () => {
    render(<AnswerOption letter="A" text="Paris" state="incorrect" />)
    expect(screen.getByLabelText("Incorrect answer")).toBeInTheDocument()
  })

  it("is disabled and unclickable when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<AnswerOption letter="A" text="Paris" disabled onClick={onClick} />)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    await user.click(button).catch(() => {})
    expect(onClick).not.toHaveBeenCalled()
  })

  it("fires onClick when enabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<AnswerOption letter="A" text="Paris" onClick={onClick} />)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
