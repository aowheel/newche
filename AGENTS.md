# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app`; routes such as `login`, `webhook`, and dashboard views sit here alongside `globals.css`.
- Shared UI sits in `src/components` (Radix + shadcn/ui primitives in `src/components/ui`), with domain-specific pieces like `attendance.tsx` and `schedule.tsx`.
- Reusable logic and integrations live in `src/lib` (authentication/session helpers, LINE bot client, scheduling utilities) and `src/hooks`.
- Database schema and migrations are in `prisma/`; run generators before coding against the models. Public assets belong in `public/`. Tests reside in `tests/` with Vitest config in `vitest.config.mts`.

## Build, Test, and Development Commands
- `npm run dev` — start the Next.js dev server (Turbopack).
- `npm run build` / `npm start` — production build and serve.
- `npm run lint` — Next.js ESLint checks.
- `npm test` — Vitest suite (jsdom). Keep it passing before opening a PR.
- Database: `npx prisma generate` after schema edits; `npx prisma migrate dev --name <change>` to evolve the schema locally. Postinstall already runs `prisma generate`.

## Coding Style & Naming Conventions
- TypeScript + React with 2-space indentation and semicolons; prefer named exports. Use the `@/` alias for absolute imports.
- Components export PascalCase functions, files stay lowercase with dashes only when needed (e.g., `guide.tsx`).
- Styling: Tailwind utility-first; reuse shadcn/ui primitives and `class-variance-authority` patterns where present. Keep JSX minimal, push data/side effects into `src/lib`.
- Avoid logging secrets (LINE tokens, Supabase keys). Favor async server components where possible; keep client components focused on interaction.

## Testing Guidelines
- Write Vitest specs under `tests/` or alongside modules when tightly coupled; name tests after the feature (`foo.test.ts`).
- Mock external services (LINE Messaging API, Supabase) and clock/timezones when checking schedules. Keep tests deterministic and console output minimal.
- Add coverage for edge cases around attendance states and date handling (timezone boundaries).

## Commit & Pull Request Guidelines
- Follow the existing history: concise, imperative subjects are welcome (English or Japanese). Group related changes per commit.
- PRs should include: short summary, what/where you tested (e.g., `npm test`, `npm run lint`), relevant screenshots for UI changes, and linked issues/tasks when applicable.
- Mention schema changes and required env vars (.env.local) in the PR body so deploys and cron jobs stay healthy.
