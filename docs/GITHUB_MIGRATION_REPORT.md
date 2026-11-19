# GitHub Migration Report — MANJOOR

**Date:** 2026-11-19
**Task:** Initial publication of the local MANJOOR project to a new public GitHub repository.

---

## 1. Source & Destination

| Field | Value |
|-------|-------|
| Local project path | `e:\manjoor` |
| Destination repository | `https://github.com/CylendraPlatform/manjoor.git` |
| Target branch | `main` |
| Destination state before publish | Empty repository (`isEmpty: true`), public, no commits — nothing to preserve |
| Active GitHub account used | `cylendralabs-blip` (keyring) |

## 2. Git History Decision

- The local directory was **not** a Git repository and contained **no inherited Dukany `.git` history**.
- A **clean Git history** was initialized for MANJOOR (`git init -b main`). No old history exists to strip, so no backup of a prior `.git` was required.
- No existing remote was present (nothing pointed at Dukany or any other repo). No Dukany repository was touched.

## 3. Security & Privacy Audit

**Result: PASS.** No secrets or confidential data are staged for publication.

Verified excluded (confirmed via `git check-ignore`):

| Item | Why excluded | Mechanism |
|------|--------------|-----------|
| `.env` | Holds live Supabase project id + publishable key | `.gitignore` (pre-existing) |
| `مستندات متجر دكاني/` (4 PDFs) | Original **Dukany** store documents, incl. an "access data & links" credentials document — confidential operational data | `.gitignore` (**added this task**) |
| `node_modules/`, `dist/` | Dependencies / build artifacts | `.gitignore` |
| `android/local.properties` | Local SDK path + machine username | Capacitor `android/.gitignore` |
| iOS `Pods/`, `build/`, `DerivedData/`, `.gradle/` | Generated native build output | Capacitor `ios/.gitignore`, `android/.gitignore` |

Scans performed on the working tree and on the **staged diff**:

- JWT / `service_role` / password / connection-string / private-key grep across `.ts/.tsx/.js/.cjs/.mjs/.sql/.md/.toml/.json/.csv` — **no hardcoded secrets.** All `service_role` references read from `process.env` / `Deno.env`. `password` hits are Zod form-validation schema fields, not values.
- `.supabase.co` / `sb_secret_` / `sb_publishable_` / project-id literal sweep — only hit is `supabase/config.toml` → `project_id = "ovk…"`, which is the **bounty project's own ref** (public-by-design, appears in the project URL; not a credential). Retained as conventional Supabase config.
- Stray-secret file sweep (`*.pem *.key *.p12 *.keystore *.jks *.bak *.dump *.log .DS_Store`) — **none found.**
- `.env.example` is staged **intentionally** — it contains placeholders only (`YOUR-NEW-PROJECT`, `YOUR_NEW_PROJECT_ANON_KEY`).

Tracked file count: **255**.

## 4. Project Integrity (Verification)

Dependencies already installed locally (`node_modules` present; `package-lock.json` + `bun.lockb` both kept).

| Check | Command | Result |
|-------|---------|--------|
| Production build | `vite build` | PASS — 3474 modules, built in ~10s, `dist/` emitted |
| Unit tests | `vitest run` | PASS — 1/1 test passing (only one test exists in the repo) |
| TypeScript typecheck | `tsc -p tsconfig.app.json --noEmit` | Pre-existing source errors (~13; `Json` property access in `Cart.tsx`/`TrackOrder.tsx`, a Capacitor listener type, one deep-instantiation). Not environmental. **Not modified** — out of scope for a migration task. Build is unaffected (Vite/SWC does not typecheck). |
| Lint | `eslint .` | Pre-existing: 154 problems (145 errors, 9 warnings), mostly `no-explicit-any` + one `no-require-imports`. Not environmental. **Not modified** — out of scope. |

Documentation (`docs/`, `README.md`, `README_BOUNTY.md`, `RUNBOOK.md`, `AGENTS.md`, `CLAUDE.md`) and all Supabase migrations (`supabase/migrations/`, ~45 files) are included in the publication set.

## 5. Publication Status

**BLOCKED at the push step — authorization.**

- The active GitHub account `cylendralabs-blip` has permission `{pull: true, push: false}` on `CylendraPlatform/manjoor` and is **not a member** of the `CylendraPlatform` org.
- Two other authenticated accounts exist in the keyring (`orbitra2`, `dilmart-info`); their push rights on this repo could not be verified in this session (account-switch / token operations were blocked by the environment's security policy).
- Per task rules (`no --force`, stop safely on auth block), **the initial commit was created locally but not pushed.**

### Required corrective action (one of)

1. **Grant write access** to `cylendralabs-blip` on `CylendraPlatform/manjoor` (add as collaborator with Write, or add to an org team with write), then re-run the push; **or**
2. **Switch the active account** to one that already has write (`gh auth switch -u <account>`), confirm with `gh api repos/CylendraPlatform/manjoor --jq .permissions` showing `push: true`, then push.

### Push command (to run once write access is confirmed)

```bash
cd e:\manjoor
git push -u origin main
# then verify:
git rev-parse HEAD                                               # local SHA
gh api repos/CylendraPlatform/manjoor/commits/main --jq .sha     # remote SHA — must match
```

## 6. Local Commit

- Branch: `main`
- Commit message: `chore: initialize MANJOOR project from Dukany foundation`
- Remote `origin` set to `https://github.com/CylendraPlatform/manjoor.git`
- Local commit SHA: _(appended below after commit)_

## 7. Confirmation

- Dukany's original repository was **not** modified (none was present/configured locally; no remote ever pointed at it).
- Dukany's production database was **not** connected to or modified.
- No Supabase production project was created or modified.
- No destructive Git operations were used.

## 8. Outstanding / Blockers

- **Push pending** on write-access grant (section 5).
- Pre-existing TypeScript + ESLint errors remain (section 4); left as-is per the "do not modify business logic / unrelated code" restriction. Recommend addressing in a follow-up, non-migration change.

---

## Verification update — 2026-11-19

Independently verified this session via `gh api repos/CylendraPlatform/manjoor`:

- The source repository has since been **published successfully**: the remote default branch `main` exists and its tip is `b701a8568d79508a4545092c97559d93f5ae1908`, matching the local initial commit recorded above.
- The initial Git tree contains **256 tracked files** (confirmed via `git ls-tree -r origin/main`).
- The active account `cylendralabs-blip` now has write access (`{admin,maintain,pull,push,triage}: true`); the earlier `403` push block (section 5) has been resolved.

The historical account of the initial `403` push failure is preserved above. This update records the *verified current remote state only*; it does not attribute the successful push to any specific actor, which was not independently determined.
