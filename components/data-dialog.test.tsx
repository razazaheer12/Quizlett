import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { ImportDialog } from "./data-dialog"
import { QuizlettProvider } from "@/hooks/use-quizlett"

function renderDialog() {
  return render(
    <QuizlettProvider>
      <ImportDialog open onOpenChange={() => {}} />
    </QuizlettProvider>,
  )
}

describe("ImportDialog", () => {
  it("shows an error for empty input", async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.click(screen.getByRole("button", { name: /validate/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/paste your exported json/i)
  })

  it("shows an error for malformed JSON", async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.click(screen.getByLabelText(/exported quizlett json/i))
    await user.paste("{not json")
    await user.click(screen.getByRole("button", { name: /validate/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid json/i)
  })

  it("shows an error for a well-formed but incompatible payload", async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.click(screen.getByLabelText(/exported quizlett json/i))
    await user.paste('{"hello":"world"}')
    await user.click(screen.getByRole("button", { name: /validate/i }))
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument())
  })

  it("reaches the confirmation preview for a valid bundle", async () => {
    const user = userEvent.setup()
    renderDialog()
    const bundle = {
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: {
        version: 2,
        currentMathQuestion: 0,
        programmingAnswers: {},
        gkAnswers: {},
        results: [],
        totalScore: 0,
        earnedAchievements: [],
        active: {},
      },
      history: { version: 2, attempts: [] },
    }
    // Paste rather than type to avoid per-character escaping of the JSON braces.
    const textarea = screen.getByLabelText(/exported quizlett json/i)
    await user.click(textarea)
    await user.paste(JSON.stringify(bundle))
    await user.click(screen.getByRole("button", { name: /validate/i }))
    expect(await screen.findByText(/replace your current data/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /replace my data/i })).toBeInTheDocument()
  })
})
