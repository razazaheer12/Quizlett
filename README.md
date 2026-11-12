<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/logo-inverse.png" />
  <source media="(prefers-color-scheme: light)" srcset="public/brand/logo.png" />
  <img src="public/brand/logo.png" alt="Quizlett logo" width="104" height="104" />
</picture>

# Quizlett

**A modern, local-first interactive quiz platform.**
Test what you know. Discover what you don't.

**🔗 [Live Demo](https://quizlett-mcqs.vercel.app/)** &nbsp;·&nbsp; **📦 [Repository](https://github.com/razazaheer12/Quizlett)**

[![Live](https://img.shields.io/badge/Live_Demo-quizlett--mcqs.vercel.app-success?logo=vercel&logoColor=white)](https://quizlett-mcqs.vercel.app/)
[![CI](https://github.com/razazaheer12/Quizlett/actions/workflows/ci.yml/badge.svg)](https://github.com/razazaheer12/Quizlett/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](#-testing)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Local-first](https://img.shields.io/badge/storage-local--first-success)](#-data-privacy--persistence)

</div>
<p align="center">
  <img width="1920" height="1583" alt="image" src="https://github.com/user-attachments/assets/5cdea245-1036-4b55-a0d2-abe48a76fff9" />
  <img width="1920" height="1741" alt="image" src="https://github.com/user-attachments/assets/7d4d882a-6f94-48d5-96d6-cbfb845bafb3" />

</p>

---

## 📖 Overview

**Quizlett** is a polished, portfolio-grade multiple-choice quiz experience spanning three
curated sections — **Mathematics**, **Programming**, and **General Knowledge** (**45 questions**
total, 15 per section). It pairs a restrained, dark-first indigo design system with two distinct
interaction models — a focused *sequential* mode with instant feedback, and a *batch* mode with a
question navigator, flagging, and deliberate submission — both available for **every** section.

Each attempt is configurable (question count and difficulty), deterministically shuffled from a
saved seed, and fully resumable. Completed attempts are recorded in a local **history** with an
accessible accuracy-trend chart.

Everything runs entirely in the browser. There is **no backend and no account** — progress,
scores, achievements, history, and theme preference persist to `localStorage`, so you can close
the tab and resume exactly where you left off. Your data never leaves your machine, and you can
**export** a JSON backup or **import** one back.

| At a glance |  |
|---|---|
| 🌐 Live | [quizlett-mcqs.vercel.app](https://quizlett-mcqs.vercel.app/) |
| 📚 Sections | 3 — Mathematics, Programming, General Knowledge |
| ❓ Questions | 45 (15 per section), tagged by difficulty + topic |
| 🎮 Modes | 2 — Sequential (instant feedback) & Batch (submit-to-score), for every section |
| ⚙️ Setup | Choose count (10 / 15 / All) and difficulty (All / Easy / Medium / Hard) |
| 🔀 Randomization | Seeded, deterministic shuffle of question + option order; resume-safe |
| 🕘 History | Last 50 attempts with scores, dates, and an accessible trend chart |
| 🔁 Review tools | Retry incorrect questions, flag for review, share a text summary |
| 💾 Portability | Export / import a validated JSON backup |
| 🏆 Achievements | 5 unlockable badges with animated toasts |
| ♿ Accessibility | ARIA radio-group answers, keyboard-only flow, reduced-motion support |
| 🎨 Themes | Dark-first + intentional Light mode, zero-flash load |
| 🔒 Data | 100% local-first (`localStorage`), versioned + migrated, no server |

---

## ✨ Key Features & UX Highlights

### 🎮 Dual Interactive Modes (for every section)

Quizlett uses the right interaction model for each kind of practice. Each section keeps a
sensible default (Mathematics → sequential, Programming & General Knowledge → batch), but you can
pick either mode in the setup screen before starting.

| | **Sequential Mode** | **Batch Mode** |
|---|---|---|
| **Flow** | One question at a time | All questions on a single scrollable page |
| **Feedback** | Instant correct/incorrect + explanation per question | Scored together on submit |
| **Navigation** | Linear progression with a progress bar | Question navigator pills (jump to any question) |
| **Review aids** | — | Flag questions for review; flagged state shown in the navigator |
| **Submission** | Auto-advances; completes on the last question | Sticky review bar + confirmation dialog |
| **Safety net** | — | Warns about unanswered questions before scoring; `beforeunload` guard |

### ⚙️ Quiz Setup & Seeded Randomization

Before an attempt you can choose a **question count** (10, 15, or All) and a **difficulty filter**
(All, Easy, Medium, Hard). The setup screen shows a live "N questions matched" preview and an
empty state if a filter matches nothing.

Every attempt is built from a **numeric seed**:

- Question order and answer-option order are shuffled deterministically (mulberry32 + Fisher–Yates).
- Answers are stored as **source option indices**, so shuffling the display order never invalidates a saved answer.
- The resolved question IDs and seed are persisted, so reloading mid-attempt reproduces the **exact same paper** — no reshuffle.

### 🔁 Review Tools

- **Retry incorrect** — from any results screen, start a fresh attempt containing only the questions you missed (handled gracefully when there are none).
- **Flag for review** — mark batch questions; flags persist with the active attempt and appear in the navigator and review bar.
- **Share results** — "Copy summary" puts a clean text summary (section, score, accuracy, tier, live URL) on the clipboard, with a fallback path and a success/failure toast. No external sharing services.

### 🕘 Attempt History

Completed attempts are stored **separately** from live progress (versioned `quizHistory` key,
capped at the latest 50). The History view lists each attempt with its category, date, score,
accuracy, mode, difficulty, and duration, plus a lightweight **accuracy-trend chart** rendered as
pure SVG (no charting dependency) with an accessible text alternative. History can be cleared
behind a confirmation dialog and never corrupts your current progress.

### ⌨️ Keyboard Navigation

Answer at the speed of thought — no mouse required:

| Keys | Action |
|---|---|
| <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> | Select an answer (sequential mode) |
| <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> | Select an answer by position (sequential mode) |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Move between options in a radio group |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Continue to the next question |
| <kbd>?</kbd> | Open the keyboard-help dialog |
| <kbd>Esc</kbd> | Close a dialog |

Shortcuts are suppressed while typing in a text field. A visible keyboard-help action lives in the
header, and the app respects `prefers-reduced-motion` throughout.

### 📊 Performance & Insights

Results are presented like a considered analytics report — driven entirely by **real app state**,
never fabricated numbers. Tiers are **percentage-based**, so they stay fair across 10-, 15-, or
filtered attempts:

- **Animated circular score ring** with correct / incorrect / accuracy breakdown.
- **Answer review** for every question, with an **"Incorrect only"** filter to focus study time.
- **Per-section insight copy** and an overall **performance tier**:

  | Tier | Requirement |
  |---|---|
  | 🌟 Perfect score | 100% |
  | ✅ Excellent | ≥ 80% |
  | 👍 Good work | ≥ 60% |
  | 📚 Keep learning | < 60% |

- **Final summary** with strongest / needs-review sections and a full section-by-section breakdown.

### 🏆 Gamification

Five achievements reward mastery, each with a **subtle ~1s animated toast** on unlock
(no confetti cannons, no screen shake). Rules are length-agnostic — a "perfect" section is 100%
of whatever attempt you took:

`Math Whiz` · `Code Master` · `Knowledge Guru` · `Quiz Master` · `Perfectionist`

### ♿ Accessibility

- **Radio-group semantics** for answer options (roving tabindex, arrow-key navigation, `aria-checked`).
- Correct/incorrect conveyed by **icon + text**, never color alone; `aria-live="polite"` feedback.
- Dialogs manage focus; landmarks (`header` / `main`) and a logical heading hierarchy are in place.
- Visible focus rings, 44px minimum touch targets, and full keyboard-only usability.
- The trend chart exposes an accessible label; `prefers-reduced-motion` disables animation.

> Lighthouse/axe scores are **not** claimed here — they require a real browser run. See
> [Manual QA for the author](#-manual-qa-for-the-author).

### 🎨 Theme System

- **Dark-first indigo identity** — near-black surfaces, soft blue-violet accents, hairline borders.
- **Ambient environment** — two restrained radial glows plus a fine noise grain, layered behind content.
- **Intentional Light mode** — separately tuned design tokens, not a naive color inversion.
- **Zero-flash loading** — a tiny pre-paint script applies the saved theme before first render.

### 🔒 Data Privacy & Persistence

- Progress, answers, scores, achievements, and theme sync to `localStorage`.
- A **sanitizing loader** clamps and validates persisted data, so a corrupt or partial payload can never break the app.
- **Resume** any in-progress section from the home dashboard; **reset** anytime from the header settings menu, behind a confirmation dialog.

#### localStorage architecture

| Key | Contents | Versioning |
|---|---|---|
| `quizProgress` | Active attempts, section results, scores, achievements | `version: 2`, with a backward-compatible **v1 → v2 migration** |
| `quizHistory` | Completed attempt records (latest 50) | `version: 2` |
| `theme` | `"dark"` \| `"light"` | — |

Persisted shapes are validated with **Zod** on import and sanitized tolerantly on routine load.
The v1 migration reconstructs in-progress attempts from the legacy `currentMathQuestion`,
`programmingAnswers`, and `gkAnswers` fields, and preserves completed results and achievements —
so an existing user upgrades without losing data. **Export** produces a versioned JSON bundle;
**Import** validates it and shows a confirmation preview before anything is overwritten (a failed
import leaves your data untouched).

---

## 🏗️ Project Architecture & Folder Structure

Quizlett is a **local-first client experience**: a single typed state provider owns all quiz
logic, and a slim router swaps between focused views. Pure domain logic lives in `lib/`, state in
the provider, and presentation in components.

```text
Quizlett/
├── .github/workflows/ci.yml          # CI: install → typecheck → lint → test → build
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Metadata, Inter font, pre-paint theme script
│   ├── page.tsx                      # Client router: provider + view switching + beforeunload guard
│   ├── globals.css                   # Design tokens, ambient background, reduced-motion rules
│   └── *.png                         # Favicon / apple-icon / OG / Twitter cards (generated)
│
├── components/
│   ├── app-shell.tsx                 # Header, theme toggle, settings menu, keyboard-help, Toaster
│   ├── brand-mark.tsx                # Theme-aware brand logo mark
│   ├── score-ring.tsx                # Animated circular score indicator
│   ├── share-button.tsx              # "Copy summary" with clipboard fallback + toast
│   ├── reset-dialog.tsx              # Shared "reset progress" confirmation
│   ├── keyboard-help-dialog.tsx      # Shortcut reference (? key / header action)
│   ├── data-dialog.tsx               # Export + Import (validate → preview → confirm) dialogs
│   ├── achievement-toast.tsx         # Achievement-unlocked celebration toasts
│   ├── quiz/
│   │   ├── answer-option.tsx         # A–D control: idle/selected/correct/incorrect/dimmed (radio-capable)
│   │   ├── answer-group.tsx          # WAI-ARIA radiogroup: roving tabindex + arrow keys
│   │   └── question-navigator.tsx    # Jump-to-question pills with answered + flagged states
│   ├── views/
│   │   ├── home-view.tsx             # Dashboard: hero, progress, continue, sections, achievements
│   │   ├── quiz-flow.tsx             # Per-section dispatcher: setup → attempt → results
│   │   ├── setup-view.tsx            # Mode / count / difficulty selection + live match preview
│   │   ├── sequential-view.tsx       # Sequential quiz with instant feedback (any section)
│   │   ├── batch-view.tsx            # Batch quiz with navigator + flagging (any section)
│   │   ├── results-view.tsx          # Per-section report, answer review, retry-incorrect, share
│   │   ├── summary-view.tsx          # Final cross-section summary + share
│   │   └── history-view.tsx          # Attempt history list + accessible SVG trend chart
│   └── ui/                           # shadcn/ui primitives (button, card, dialog, …)
│
├── hooks/
│   └── use-quizlett.tsx              # State provider: quiz flow, persistence, history, theme, achievements
│
├── lib/
│   ├── types.ts                      # Shared domain types (Question, QuizConfig, AttemptRecord, …)
│   ├── questions.ts                  # 45 typed questions + section metadata
│   ├── quiz.ts                       # Pure engine: filtering, seeded config, display options, scoring
│   ├── random.ts                     # Deterministic PRNG, shuffle, option ordering, seed creation
│   ├── schemas.ts                    # Zod schemas + question-bank validation + schema version
│   ├── achievements.ts               # Achievement definitions + length-agnostic evaluation
│   ├── insights.ts                   # Score stats, percentage tiers, insight copy
│   ├── storage.ts                    # Sanitized localStorage I/O, v1→v2 migration, export/import
│   └── utils.ts                      # cn() class helper
│
├── public/brand/                     # Master + inverse brand marks (generated)
├── scripts/                          # Brand-asset generation + env sanity check
├── vitest.config.ts / vitest.setup.ts# Test runner config (jsdom + React Testing Library)
├── .eslintrc.json                    # next/core-web-vitals + next/typescript
├── next.config.mjs                   # Next.js config (no type/lint suppression)
├── tailwind.config.ts                # Tokens, shadows, radii, motion keyframes
├── pnpm-workspace.yaml               # pnpm build-script policy
├── tsconfig.json                     # TypeScript config (strict)
└── package.json
```

### Layered responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Data** | `lib/questions.ts` | Typed question bank + section metadata (single source of truth) |
| **Engine** | `lib/quiz.ts`, `lib/random.ts` | Pure, testable filtering, seeded shuffle, scoring |
| **Validation** | `lib/schemas.ts` | Zod schemas, schema version, bank validation |
| **Domain** | `lib/achievements.ts`, `lib/insights.ts` | Pure functions: tiers, stats, achievement rules |
| **Persistence** | `lib/storage.ts` | Sanitized `localStorage` I/O, migration, export/import |
| **State** | `hooks/use-quizlett.tsx` | One provider: quiz flow, results, history, achievements, theme |
| **Shell** | `components/app-shell.tsx` | Chrome: header, theme toggle, settings, toast host |
| **Views** | `components/views/*` | The screens the router swaps between |
| **Primitives** | `components/ui/*`, `components/quiz/*` | Reusable, accessible building blocks |

> [!NOTE]
> `next.config.mjs` no longer suppresses type or lint errors — `next build` runs the full
> TypeScript and ESLint gate. `pnpm typecheck` and `pnpm lint` are also available standalone.

---

## 🧭 Adding Questions

The question bank is the single source of truth in **`lib/questions.ts`**. Each section is an
array of `Question` objects:

```ts
{
  id: 46,                       // globally unique across ALL sections
  question: "What is 2 + 2?",   // non-empty prompt
  options: ["3", "4", "5", "6"],// exactly 4 meaningful, non-empty options
  correctAnswer: 1,             // index into options (0–3) of the ONE correct answer
  explanation: "Basic addition.", // shown after answering; must be correct
  difficulty: "easy",           // "easy" | "medium" | "hard"
  topic: "Algebra",             // free-form tag used for spread/coverage
}
```

Rules enforced by `validateQuestionBank()` (run in dev and covered by tests):

1. **Unique IDs** across the whole bank — never reuse an ID.
2. **Exactly 4 options**, each non-empty; `correctAnswer` must reference a valid index (0–3).
3. A valid **difficulty** and a non-empty **topic**.
4. No duplicate or misleading prompts; facts and explanations must be correct.

After editing, run `pnpm test` (the bank-integrity suite will fail on any violation) and
`pnpm typecheck`. Topic suggestions per section: Mathematics — Algebra, Calculus, Geometry,
Trigonometry, Statistics; Programming — JavaScript, Web Dev, Data Structures, Algorithms,
Databases; General Knowledge — Geography, History, Science, Arts & Culture, World Facts.

> [!IMPORTANT]
> Never change the `id` or option **order** of an existing question. Saved answers reference
> questions by ID and options by source index; changing them would invalidate in-progress and
> stored attempts.

---

## 🚀 Getting Started & Local Development

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 18.18+ (20+ recommended) | Required by Next.js 15 — [download](https://nodejs.org/) |
| **pnpm** | 10+ | Recommended package manager — [install](https://pnpm.io/installation) |

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/razazaheer12/Quizlett.git
cd Quizlett

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev
```

Then open **http://localhost:3000** in your browser.

> [!TIP]
> The **first** navigation to `/` triggers an on-demand cold compile. That one-time delay is
> normal Next.js dev behavior — subsequent loads and hot reloads are near-instant.

---

## 📜 Scripts Reference

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server at [localhost:3000](http://localhost:3000) with hot reload |
| `pnpm build` | Create an optimized production build (`.next/`) |
| `pnpm start` | Serve the production build (run `pnpm build` first) |
| `pnpm lint` | Run ESLint (`next/core-web-vitals` + `next/typescript`) |
| `pnpm typecheck` | Type-check the whole project without emitting (`tsc --noEmit`) |
| `pnpm test` | Run the Vitest suite once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:coverage` | Run tests and print a coverage report |
| `pnpm check` | Full gate: typecheck → lint → test → build |
| `node scripts/generate-brand-assets.js` | Regenerate the inverse logo, favicons, and social cards |

---

## ✅ Continuous Integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`: it installs with a
frozen lockfile (pnpm, Node 20, cached) and fails if **any** of `typecheck`, `lint`, `test`, or
`build` fails. The badge at the top reflects the latest run once the workflow has executed on
GitHub.

---

## 🧪 Testing

The suite uses **Vitest + React Testing Library** (jsdom). It covers the pure engine and storage
layer plus key accessible components:

- `lib/random` — determinism, permutation integrity, seed stability.
- `lib/quiz` — difficulty filtering, count resolution, seeded config, option→source mapping, scoring.
- `lib/insights` — accuracy, variable-length stats, percentage-tier boundaries, zero-total edges.
- `lib/achievements` — every badge, perfect/partial/completion rules, length-agnostic behavior.
- `lib/storage` — load/save, corrupt + out-of-range payloads, **v1→v2 migration**, history limits, export/import validation.
- `lib/questions` — bank integrity, unique IDs, schema conformance, topic spread.
- Components — answer-option states, radio-group semantics + keyboard nav, navigator answered/flagged states, import-dialog validation.

Run `pnpm test:coverage` for the current numbers. Statement coverage across the `lib/` logic
modules is ~90%+ (the pure `types.ts` module has no runtime code and is excluded from meaningful
coverage).

---

## 🧭 Manual QA for the author

Some checks require a real browser and are intentionally **not** automated or claimed here:

- [ ] Lighthouse (Performance / Accessibility / Best Practices / SEO) on the deployed site — record actual scores.
- [ ] Full keyboard-only run-through of every flow (setup → sequential → batch → results → summary → history).
- [ ] Responsive inspection at 360 / 390 / 768 / desktop widths (no overflow, 44px targets, dialogs fit).
- [ ] Screen-reader spot check of the radio groups, feedback regions, and trend chart.
- [ ] Verify the Vercel production deployment reflects the latest `main` after pushing.
- [ ] Replace README screenshots if the UI changed (none are committed yet).

---

## 🗺️ Roadmap (honest)

Done in this upgrade: 45-question validated bank, both modes for every section, configurable
count/difficulty, seeded resume-safe randomization, attempt history + trend chart, retry-incorrect,
flagging, export/import, share-summary, accessibility pass, automated tests, and CI.

Not done / deliberately out of scope (local-first, no backend): accounts, cloud sync,
leaderboards, streaks/coins, a service worker/PWA, and heavy charting libraries. Possible next
steps: per-topic practice, spaced-repetition review, and Playwright end-to-end smoke tests.

---

## 📄 License & Credits

### License

No formal license file is included yet — the project is currently **unlicensed (all rights
reserved by the author)** and shared for demonstration and portfolio purposes. If you'd like to
reuse it, add a `LICENSE` of your choice (e.g. MIT) and declare it in `package.json`.

### Credits

Built with excellent open-source tools:

- **[Next.js](https://nextjs.org/)** — the React framework (App Router)
- **[React](https://react.dev/)** — UI library
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)** — accessible component primitives
- **[Zod](https://zod.dev/)** — schema validation
- **[Vitest](https://vitest.dev/)** & **[Testing Library](https://testing-library.com/)** — automated tests
- **[Lucide](https://lucide.dev/)** — icon set
- **[Inter](https://rsms.me/inter/)** — typeface

---

## Author 

<div>

Built with focus, calm, and ☕ by [Raza Zaheer](https://github.com/razazaheer12)

</div>

---

<div align="center">

**[🔗 Try the Live Demo](https://quizlett-mcqs.vercel.app/)** &nbsp;·&nbsp; **[📦 View on GitHub](https://github.com/razazaheer12/Quizlett)**

**Happy quizzing! 🧠✨**

</div>
