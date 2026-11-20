# Git integration audit

Date: 2026-11-20. Tip inspected: `feat/manjoor-whatsapp-sales` @ `709e17eb60b85faea22639d5ed593bf442cae8f8`. Remote: `CylendraPlatform/manjoor`.

## Pull request status (all OPEN, none merged)

| PR | Head | Base | SHA of head |
|---|---|---|---|
| [#1](https://github.com/CylendraPlatform/manjoor/pull/1) | `feat/manjoor-phase01-stabilization` | `main` | `64080be` |
| [#2](https://github.com/CylendraPlatform/manjoor/pull/2) | `feat/manjoor-public-sales-platform` | `feat/manjoor-phase01-stabilization` | `5e9cccf` |
| [#3](https://github.com/CylendraPlatform/manjoor/pull/3) | `feat/manjoor-live-leads-activation` | `feat/manjoor-public-sales-platform` | `880b7d9` |
| [#4](https://github.com/CylendraPlatform/manjoor/pull/4) | `feat/manjoor-concept-gallery` | `feat/manjoor-live-leads-activation` | `3521f00` |
| [#5](https://github.com/CylendraPlatform/manjoor/pull/5) | `feat/manjoor-visual-excellence` | `feat/manjoor-concept-gallery` | `5fdadcd` |
| [#6](https://github.com/CylendraPlatform/manjoor/pull/6) | `feat/manjoor-hero-carousel` | `feat/manjoor-visual-excellence` | `163b231` |
| [#7](https://github.com/CylendraPlatform/manjoor/pull/7) | `feat/manjoor-whatsapp-sales` | `feat/manjoor-hero-carousel` | `709e17e` |

`main` remains `b701a85` (initial MANJOOR import). No PR has a merge commit.

## Ancestry

Each listed head is a fast-forward ancestor of the next. `git merge-base --is-ancestor` succeeded for the full chain from `main` through PR #7.

`git rev-list --left-right --count origin/main...feat/manjoor-whatsapp-sales` → `0	33`.

There are **no unique commits on `main`**. The WhatsApp tip already contains all 33 intended commits from PRs #1–#7.

## Combined tree (no extra merge commit)

Resulting history if `main` is fast-forwarded:

```
b701a85 (current main)
  … Phase 01 / 02 / 03 / gallery / visuals / hero …
163b231  hero photos (PR #6 tip)
709e17e  WhatsApp sales (PR #7 tip)  ← proposed main
```

## Recommended merge (requires approval)

Do **not** merge the seven PRs one-by-one into their stacked bases. That would create extra merge commits and GitHub base-branch noise.

After quality/security review:

```bash
git checkout main
git merge --ff-only feat/manjoor-whatsapp-sales
git push origin main
```

Then close PRs #1–#7 as incorporated (GitHub will not always auto-close stacked PRs whose base is not `main`).

Do not squash-merge PR #7 onto `main` unless the team accepts rewriting the published 33-commit story. Do not force-push. Do not merge automatically from this audit.

## Overlap

Because the stack is linear, there is no conflicting duplicate of the same files at different SHAs. Later PRs refine earlier files (hero, WhatsApp, leads docs). The combined diff vs `main` is 316 files, +5784 / −437.

## Discrepancies vs older reports

- PR #3 title still says “blocked on database”; the tip includes the applied `20261119200000` lead migration and live RPC tests.
- `docs/phase-03/WHATSAPP_CONFIGURATION.md` previously said WhatsApp was unset; the tip uses `VITE_BUSINESS_WHATSAPP`.
- Phase 02 `LAUNCH_READINESS.md` still describes unapplied leads; treat `docs/launch/` as current.
