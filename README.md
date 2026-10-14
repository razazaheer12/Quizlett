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
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Local-first](https://img.shields.io/badge/storage-local--first-success)](#-data-privacy--persistence)

</div>
<p align="center">
  <img src="https://github.com/user-attachments/assets/e36ced98-248e-4322-81d7-56dc542a8ad6" width="100%" alt="Quizlett Preview">
</p>

---

## 📖 Overview

**Quizlett** is a polished, portfolio-grade multiple-choice quiz experience spanning three
curated sections — **Mathematics**, **Programming**, and **General Knowledge** (30 questions
total). It pairs a restrained, dark-first indigo design system with two distinct interaction
models: a focused *one-at-a-time* mode with instant feedback, and a *batch* mode with a
question navigator and deliberate submission flow.

Everything runs entirely in the browser. There is **no backend and no account** — progress,
scores, achievements, and theme preference persist to `localStorage`, so you can close the tab
and resume exactly where you left off. Your data never leaves your machine.

| At a glance |  |
|---|---|
| 🌐 Live | [quizlett-mcqs.vercel.app](https://quizlett-mcqs.vercel.app/) |
| 📚 Sections | 3 — Mathematics, Programming, General Knowledge |
| ❓ Questions | 30 (10 per section) |
| 🎮 Modes | 2 — Sequential (instant feedback) & Batch (submit-to-score) |
| 🏆 Achievements | 5 unlockable badges with animated toasts |
| 🎨 Themes | Dark-first + intentional Light mode, zero-flash load |
| 🔒 Data | 100% local-first (`localStorage`), no server |

---

## ✨ Key Features & UX Highlights

### 🎮 Dual Interactive Modes

Quizlett uses the right interaction model for each kind of practice:

| | **Sequential Mode** — Mathematics | **Batch Mode** — Programming & General Knowledge |
|---|---|---|
| **Flow** | One question at a time | All 10 questions on a single scrollable page |
| **Feedback** | Instant correct/incorrect + explanation per question | Scored together on submit |
| **Navigation** | Linear progression with a progress bar | Question navigator pills (jump to any question) |
| **Submission** | Auto-advances; completes on question 10 | Sticky review bar + confirmation dialog |
| **Safety net** | — | Warns about unanswered questions before scoring |

- **Instant feedback** turns each math question into a learning moment — a clear
  correct/incorrect state, the right answer, and a concise explanation, inline (no modal overload).
- **The batch review bar** tracks `answered / 10` in a sticky footer, and attempting to submit
  with blanks raises a refined *"You still have N unanswered questions"* dialog with
  **Go back** / **Submit anyway** choices.

### ⌨️ Keyboard Navigation

Answer at the speed of thought — no mouse required in Sequential Mode:

| Keys | Action |
|---|---|
| <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> | Select an answer |
| <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> | Select an answer (alternative) |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Continue to the next question |

A subtle shortcut hint surfaces in the header on desktop, and the app respects
`prefers-reduced-motion` throughout.

### 📊 Performance & Insights

Results are presented like a considered analytics report — driven entirely by **real app state**,
never fabricated numbers:

- **Animated circular score ring** with correct / incorrect / accuracy breakdown.
- **Answer review** for every question, with an **"Incorrect only"** filter to focus study time.
- **Per-section insight copy** and an overall **performance tier**:

  | Tier | Requirement |
  |---|---|
  | 🌟 Perfect score | 30 / 30 |
  | ✅ Excellent | ≥ 24 / 30 |
  | 👍 Good work | ≥ 18 / 30 |
  | 📚 Keep learning | < 18 / 30 |

- **Final summary** with strongest / needs-review sections and a full section-by-section breakdown.

### 🏆 Gamification

Five achievements reward mastery, each with a **subtle ~1s animated toast** on unlock
(no confetti cannons, no screen shake — this is a premium product):

`Math Whiz` · `Code Master` · `Knowledge Guru` · `Quiz Master` · `Perfectionist`

Locked achievements clearly communicate their requirement and progress toward unlocking.

### 🎨 Theme System

- **Dark-first indigo identity** — near-black surfaces, soft blue-violet accents, hairline borders.
- **Ambient environment** — two restrained radial glows plus a fine noise grain, layered behind content.
- **Intentional Light mode** — separately tuned design tokens, not a naive color inversion.
- **Zero-flash loading** — a tiny pre-paint script applies the saved theme before first render;
  the preference persists across sessions.

### 🔒 Data Privacy & Persistence

- Progress, answers, scores, achievements, and theme sync to `localStorage`
  (keys: `quizProgress`, `theme`).
- A **sanitizing loader** clamps and validates persisted data, so a corrupt or partial payload
  can never break the app.
- **Resume** any in-progress section from the home dashboard; **reset** anytime from the
  header settings menu, behind a confirmation dialog.

---

## 🏗️ Project Architecture & Folder Structure

Quizlett is a **local-first client experience**: a single typed state provider owns all quiz
logic, and a slim router swaps between five focused views. Domain data, achievements,
persistence, and analytics are isolated in `lib/`.

```text
Quizlett/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Metadata, Inter font, pre-paint theme script
│   ├── page.tsx                      # Client router: QuizlettProvider + view switching
│   ├── globals.css                   # Design tokens, ambient background, base styles
│   ├── icon.png                      # Favicon (generated brand tile)
│   ├── apple-icon.png                # Apple touch icon (generated)
│   ├── opengraph-image.png           # Open Graph social card (generated)
│   └── twitter-image.png             # Twitter/X social card (generated)
│
├── components/
│   ├── app-shell.tsx                 # Sticky header, theme toggle, settings/reset, toasts
│   ├── brand-mark.tsx                # Theme-aware brand logo mark
│   ├── score-ring.tsx                # Animated circular score indicator
│   ├── reset-dialog.tsx              # Shared "reset progress" confirmation
│   ├── achievement-toast.tsx         # Achievement-unlocked celebration toasts
│   ├── quiz/
│   │   ├── answer-option.tsx         # A–D control: idle/selected/correct/incorrect/dimmed
│   │   └── question-navigator.tsx    # Jump-to-question pills for batch quizzes
│   ├── views/
│   │   ├── home-view.tsx             # Dashboard: hero, progress, sections, achievements
│   │   ├── math-view.tsx             # Sequential quiz with instant feedback
│   │   ├── batch-view.tsx            # Batch quiz (programming / general knowledge)
│   │   ├── results-view.tsx          # Per-section report + answer review
│   │   └── summary-view.tsx          # Final cross-section summary
│   └── ui/                           # shadcn/ui primitives (button, card, dialog, …)
│
├── hooks/
│   └── use-quizlett.tsx              # State provider: quiz flow, persistence, theme, achievements
│
├── lib/
│   ├── types.ts                      # Shared domain types (Question, SectionResult, …)
│   ├── questions.ts                  # 30 typed questions + section metadata
│   ├── achievements.ts               # Achievement definitions + evaluation
│   ├── insights.ts                   # Score stats, performance tiers, insight copy
│   ├── storage.ts                    # localStorage load/save (sanitized) for progress + theme
│   └── utils.ts                      # cn() class helper
│
├── public/
│   └── brand/
│       ├── logo.png                  # Master brand mark (black ink, transparent bg)
│       └── logo-inverse.png          # Inverse mark for dark surfaces (generated)
│
├── scripts/
│   ├── generate-brand-assets.js      # Regenerate inverse mark, favicons, and social cards
│   └── verify-env.js                 # Environment sanity check
│
├── next.config.mjs                   # Next.js config (dev indicator disabled, unoptimized images)
├── tailwind.config.ts                # Tokens, shadows, radii, motion keyframes
├── pnpm-workspace.yaml               # pnpm build-script policy
├── tsconfig.json                     # TypeScript config (strict)
└── package.json
```

### Layered responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Data** | `lib/questions.ts` | Typed question bank + section metadata (single source of truth) |
| **Domain** | `lib/achievements.ts`, `lib/insights.ts` | Pure functions: scoring, tiers, achievement rules |
| **Persistence** | `lib/storage.ts` | Sanitized `localStorage` read/write for progress + theme |
| **State** | `hooks/use-quizlett.tsx` | One provider: quiz flow, results, achievements, theme |
| **Shell** | `components/app-shell.tsx` | Chrome: header, theme toggle, settings, toast host |
| **Views** | `components/views/*` | The five screens the router swaps between |
| **Primitives** | `components/ui/*`, `components/quiz/*` | Reusable, accessible building blocks |

> [!NOTE]
> `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so
> `next build` will **not** fail on type errors. Run `pnpm exec tsc --noEmit` separately for
> type safety (see [Scripts](#-scripts-reference)).

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
> The **first** navigation to `/` triggers an on-demand cold compile (~20s for ~1,000 modules).
> That one-time delay is normal Next.js dev behavior — subsequent loads and hot reloads are near-instant.

> [!NOTE]
> **Using npm instead of pnpm?** `npm install && npm run dev` works too. This repo is optimized
> for pnpm (see `pnpm-workspace.yaml`).

<details>
<summary><b>Troubleshooting</b> — <code>ERR_PNPM_IGNORED_BUILDS: sharp</code></summary>

`sharp` ships a native build script, but this app sets `images.unoptimized: true`, so the binary
is never used. The repo already declares an explicit decision in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  sharp: false
```

If you ever see `ERR_PNPM_IGNORED_BUILDS`, confirm that block is present, then re-run
`pnpm install`. This keeps pnpm's pre-run dependency check (which `pnpm dev` performs) from
failing before the server starts.

</details>

---

## 📜 Scripts Reference

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server at [localhost:3000](http://localhost:3000) with hot reload |
| `pnpm build` | Create an optimized production build (`.next/`) |
| `pnpm start` | Serve the production build (run `pnpm build` first) |
| `pnpm lint` | Run ESLint via `next lint` — see note below |
| `pnpm exec tsc --noEmit` | Type-check the whole project without emitting files |
| `node scripts/generate-brand-assets.js` | Regenerate the inverse logo, favicons, and social cards |

> [!WARNING]
> This repository does **not** currently ship an ESLint configuration, so `pnpm lint`
> (`next lint`) will prompt to set one up interactively on first run. For a fast correctness
> gate, prefer `pnpm exec tsc --noEmit`.

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
