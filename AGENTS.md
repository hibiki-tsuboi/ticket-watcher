# Repository Guidelines
- **常に日本語で回答する**

## Project Structure & Module Organization
- Keep app code in `src/` and tests in `tests/`. Place helper scripts in `scripts/`, config in `config/`, and docs in `docs/`.
- Example layout:
  - `src/` core code (e.g., `src/watchers/`, `src/cli/`).
  - `tests/` mirrors `src/` (e.g., `tests/watchers/`).
  - `.env.example` documents required env vars; never commit real secrets.

## Build, Test, and Development Commands
- Standardize via a `Makefile` or `package.json` scripts. Prefer these names:
  - `make setup` — install dependencies.
  - `make run` — run the local app (watch mode if supported).
  - `make test` — run the full test suite.
  - `make lint` / `make format` — check/format code.
- If using Node.js: `npm i`, `npm run test`, `npm run lint`. If Python: `uv pip install -r requirements.txt`, `pytest -q`.

## Coding Style & Naming Conventions
- Use an auto-formatter and linter. Suggested defaults:
  - JavaScript/TypeScript: Prettier + ESLint.
  - Python: Black + Ruff.
- Naming:
  - Directories: `kebab-case` (e.g., `ticket-sources/`).
  - Files: language idioms (`snake_case.py`, `kebab-case.ts`).
  - Public APIs: descriptive, verb-forward function names (e.g., `fetchTickets`).

## Testing Guidelines
- Framework: choose per language (Jest/Vitest for JS/TS; Pytest for Python).
- Mirror `src/` structure; name tests like `test_<module>.py` or `<name>.test.ts`.
- Aim for ≥80% line coverage on changed code. Include at least one integration test for core flows (e.g., polling and notifying).

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Keep PRs focused and small. Include:
  - Purpose and context; link issues (e.g., `#12`).
  - Summary of changes, testing notes, and any screenshots of CLI/UI output.
  - Update `README.md` and this file when adding tooling or commands.

## Security & Configuration Tips
- Never commit secrets. Use `dotenv`/environment variables and provide `.env.example`.
- Add basic secret scanning (e.g., `pre-commit` with `detect-secrets`) and dependency audit (`npm audit` or `pip-audit`).

## Agent-Specific Notes
- Prefer minimal, surgical changes; avoid drive-by refactors.
- When adding modules, create matching tests and update the Make/script targets.
