# Repository Guidelines

## Project Structure & Module Organization
- `src/app` contains the Next.js App Router routes, layouts, and UI entry points.
- `src/features` holds feature-focused modules and components.
- `src/lib` is for shared utilities and integrations (e.g., API clients).
- `public` stores static assets served at the site root.
- `supabase/migrations` contains database migration SQL; `supabase/config.toml` holds local config.

## Build, Test, and Development Commands
Use `pnpm` (lockfile is `pnpm-lock.yaml`).
- `pnpm dev`: run the Next.js dev server.
- `pnpm build`: create a production build.
- `pnpm start`: start the production server after a build.
- `pnpm check`: run Biome checks (no write).
- `pnpm check:write`: run Biome with auto-fixes and formatting.
- After implementing changes, run `pnpm check`.

## Coding Style & Naming Conventions
- Formatting and linting are handled by Biome (`biome.json`). Run `pnpm check` (or `pnpm check:write` for auto-fixes) before commits.
- Use TypeScript and follow existing file naming conventions in `src/`.
- Prefer descriptive component and module names aligned with feature boundaries.
- Zod is v4. Prefer top-level string format helpers (method forms like `z.string().email()` are deprecated).
  - Examples: `z.email()`, `z.url()`, `z.uuid()`, `z.guid()`, `z.ipv4()`, `z.ipv6()`, `z.cidrv4()`, `z.cidrv6()`
  - ISO helpers: `z.iso.date()`, `z.iso.time()`, `z.iso.datetime()`, `z.iso.duration()`

## Testing Guidelines
- No automated test runner is configured yet.
- If you add tests, document the framework and add a `pnpm test` script.

## Commit & Pull Request Guidelines
- Commit history uses short, imperative messages (e.g., "upgrade nextjs"). Keep them concise and focused.
- PRs should include a clear summary, steps to verify, and screenshots for UI changes.
- Link related issues or tickets when applicable.

## Communication
- Collaboration and discussions should be conducted in Japanese.
- Application UI language is English.

## Security & Configuration Tips
- Store secrets in `.env.local` and avoid committing sensitive values.
- Supabase changes should include matching migrations in `supabase/migrations`.
