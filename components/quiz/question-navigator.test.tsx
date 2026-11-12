import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { QuestionNavigator } from "./question-navigator"
import type { Question } from "@/lib/types"

const questions: Question[] = [1, 2, 3].map((id) => ({
  id,
  question: `Q${id}`,
  options: ["a", "b", "c", "d"],
  correctAnswer: 0,
  explanation: "e",
  difficulty: "easy",
  topic: "t",
}))

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe("QuestionNavigator", () => {
  it("renders one control per question, zero-padded", () => {
    render(<QuestionNavigator questions={questions} answers={{}} />)
    expect(screen.getByLabelText("Question 1: unanswered")).toBeInTheDocument()
    expect(screen.getByText("01")).toBeInTheDocument()
    expect(screen.getByText("03")).toBeInTheDocument()
  })

  it("marks answered questions", () => {
    render(<QuestionNavigator questions={questions} answers={{ 2: 1 }} />)
    expect(screen.getByLabelText("Question 2: answered")).toBeInTheDocument()
    expect(screen.getByLabelText("Question 1: unanswered")).toBeInTheDocument()
  })

  it("scrolls to the question on click", async () => {
    const user = userEvent.setup()
    const spy = vi.spyOn(Element.prototype, "scrollIntoView")
    const node = document.createElement("div")
    node.id = "question-3"
    document.body.appendChild(node)
    render(<QuestionNavigator questions={questions} answers={{}} />)
    await user.click(screen.getByLabelText("Question 3: unanswered"))
    expect(spy).toHaveBeenCalled()
    node.remove()
  })

  it("reflects flagged state in the accessible name", () => {
    render(<QuestionNavigator questions={questions} answers={{}} flags={[1]} />)
    expect(screen.getByLabelText(/Question 1/i).getAttribute("aria-label")).toMatch(/flagged/i)
  })
})
