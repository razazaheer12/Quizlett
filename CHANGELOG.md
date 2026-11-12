# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) where practical.

## [Unreleased]

### Added

- **Expanded question bank** from 30 to **45 questions** (15 per section), each tagged with a
  `difficulty` (easy/medium/hard) and a `topic`. All 30 original questions are preserved with
  stable IDs and option order.
- **Quiz setup** screen per section: choose mode (sequential/batch), question count (10 / 15 /
  All), and difficulty filter (All / Easy / Medium / Hard), with a live "N questions matched"
  preview and an empty state when a filter matches nothing.
- **Seeded, deterministic randomization** (`lib/random.ts`): question order and answer-option
  order are shuffled from a saved seed; answers are stored as source option indices so a resumed
  attempt reproduces the exact same paper after reload.
- **Both modes for every section** — sequential and batch are no longer hard-wired per category.
- **Attempt history** (`quizHistory` localStorage key, versioned, latest 50): a History view with
  per-attempt score, accuracy, date, mode, difficulty, duration, and an accessible pure-SVG
  accuracy-trend chart; clearable behind a confirmation dialog.
- **Retry incorrect questions** from any results screen (graceful when there are none).
- **Flag questions** in batch mode, surfaced in the navigator and review bar, persisted with the
  active attempt.
- **Export / import progress** as a validated JSON bundle; import validates with Zod and shows a
  confirmation preview before overwriting, leaving data untouched on failure.
- **Share results** via "Copy summary" (Clipboard API with a fallback and a success/failure toast).
- **Keyboard-help dialog** (header action + `?` shortcut) documenting all shortcuts.
- **Accessibility**: ARIA radio-group answer semantics with roving tabindex and arrow-key
  navigation, `aria-live` feedback, non-color-only correct/incorrect states, 44px touch targets,
  and `beforeunload` protection for unsaved batch progress.
- **Automated tests** (Vitest + React Testing Library) covering the engine, insights,
  achievements, storage (including v1→v2 migration), question bank, and key components.
- **CI** (`.github/workflows/ci.yml`): typecheck → lint → test → build on every push/PR to `main`.
- **Zod validation** for questions, section metadata, quiz config, persisted data, and imports;
  dev-time question-bank validation.

### Changed

- **Engineering integrity**: removed `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`
  from `next.config.mjs`; the production build now runs the full type and lint gate.
- **Percentage-based performance tiers** (Perfect 100%, Excellent ≥80%, Good ≥60%) so scoring is
  fair across variable-length attempts, replacing the old fixed /30 thresholds.
- **Achievement rules** are now length-agnostic (a "perfect" section is 100% of whatever attempt
  was taken); all five original achievements are preserved.
- **Unified state provider** (`hooks/use-quizlett.tsx`) drives quiz flow, results, history,
  achievements, theme, export/import, and sharing.
- **Schema-versioned persistence** (`version: 2`) with a backward-compatible **v1 → v2 migration**
  that reconstructs in-progress attempts from legacy fields and preserves completed results.
- **Scripts**: added `typecheck`, `test`, `test:watch`, `test:coverage`, and `check`
  (typecheck → lint → test → build).
- **Metadata**: production OG/Twitter base URL defaults to the live demo; added keywords and
  canonical URL; richer description.
- Upgraded Next.js to **15.5.27** (patched AVIF + Windows RCE advisories).

### Fixed

- Legacy migration no longer drops an in-progress Mathematics attempt when the stored payload had
  a `currentMathQuestion` index but no partial result entry.
- Removed a dead runtime constant in `components/ui/use-toast.ts` that tripped ESLint.

### Documentation

- Rewrote the README for the upgraded app (45 questions, both modes, setup, history, review tools,
  export/import, accessibility, testing, CI, localStorage architecture, and a "how to add
  questions" guide).
- Added this CHANGELOG.

### Notes for the author

- No screenshots are committed; add/replace them if the UI is showcased.
- Lighthouse, axe, keyboard-only, responsive, and screen-reader checks require a real browser and
  are listed as manual QA in the README — no scores are claimed automatically.
- Verify the Vercel production deployment reflects the latest `main` after pushing.

## [Previous] — Redesigned Quizlett (commit `b034323`)

- Initial redesigned app: 30 questions (10 per section), sequential Mathematics + batch
  Programming/General Knowledge, 5 achievements, dark-first indigo design system, local-first
  `localStorage` persistence, and generated brand assets.

[Unreleased]: https://github.com/razazaheer12/Quizlett/commits/main
