# Creative direction — MANJOOR public site

## Audit (before this revision)

- Hero used a full walnut wash over group photographs; slides and the three cards below repeated the same four generated stills.
- One category tile was an empty brown block.
- Copy stacked the same disclaimer in several sections.
- Real production (wooden hookah stems in `photo/`) was absent from the public story, correctly unpublished, but the site then over-indexed on décor concepts as if they were the workshop’s identity.
- No lathe or process photograph exists in `photo/`. Presenting a generated still as “the MANJOOR workshop” would be false.

## Direction

Premium B2B wood manufacturer: light sand ground, walnut type, brass for actions, photography visible.

Public narrative in three beats:

1. **Bakarat** — real wooden hookah stems from `photo/`.
2. **Custom turning** — special manufacturing requests.
3. **Wholesale** — quantity supply for merchants.

Below the hero: typography and inquiry paths, not another brown photo grid. Full concept gallery remains `/custom-orders`.

## Asset rule

| Class | Public? |
|---|---|
| `photo/` originals | Gitignored source |
| `public/workshop/*` | Yes — processed real bakarat |
| `public/concepts/*` | Secondary, `/custom-orders` only |
| Official logo in `public/brand/` | Yes |

Maker approval is still required before treating décor concepts as confirmed production capacity.
