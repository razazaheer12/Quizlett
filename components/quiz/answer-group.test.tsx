import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AnswerGroup } from "./answer-group"
import type { DisplayOption } from "@/lib/quiz"

const options: DisplayOption[] = [
  { sourceIndex: 0, text: "Alpha" },
  { sourceIndex: 1, text: "Beta" },
  { sourceIndex: 2, text: "Gamma" },
  { sourceIndex: 3, text: "Delta" },
]

function renderGroup(props: Partial<React.ComponentProps<typeof AnswerGroup>> = {}) {
  const onSelect = vi.fn()
  render(
    <AnswerGroup
      options={options}
      label="Answers"
      stateFor={(s) => (s === props.selectedSource ? "selected" : "idle")}
      onSelect={onSelect}
      {...props}
    />,
  )
  return { onSelect }
}

describe("AnswerGroup", () => {
  it("renders a radiogroup with four radios", () => {
    renderGroup()
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Answers")
    expect(screen.getAllByRole("radio")).toHaveLength(4)
  })

  it("marks the selected option as checked", () => {
    renderGroup({ selectedSource: 2 })
    const radios = screen.getAllByRole("radio")
    expect(radios[2]).toHaveAttribute("aria-checked", "true")
    expect(radios[0]).toHaveAttribute("aria-checked", "false")
  })

  it("gives only one tab stop (roving tabindex)", () => {
    renderGroup({ selectedSource: 1 })
    const radios = screen.getAllByRole("radio")
    expect(radios[1]).toHaveAttribute("tabindex", "0")
    expect(radios[0]).toHaveAttribute("tabindex", "-1")
    expect(radios[2]).toHaveAttribute("tabindex", "-1")
  })

  it("defaults the tab stop to the first option when nothing is selected", () => {
    renderGroup()
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("tabindex", "0")
  })

  it("selects on click", async () => {
    const user = userEvent.setup()
    const { onSelect } = renderGroup()
    await user.click(screen.getByText("Gamma"))
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup()
    const { onSelect } = renderGroup({ selectedSource: 0 })
    screen.getAllByRole("radio")[0].focus()
    await user.keyboard("{ArrowDown}")
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it("wraps around at the end", async () => {
    const user = userEvent.setup()
    const { onSelect } = renderGroup({ selectedSource: 3 })
    screen.getAllByRole("radio")[3].focus()
    await user.keyboard("{ArrowRight}")
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it("does nothing when disabled", async () => {
    const user = userEvent.setup()
    const { onSelect } = renderGroup({ disabled: true })
    await user.click(screen.getByText("Alpha"))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
