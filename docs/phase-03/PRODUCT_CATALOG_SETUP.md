# Product catalog setup

## Decision
Zero products were marked `public_approved`.

`photo/` is the only local image set. The files are photographs of turned wooden hookah stems (bark-covered, smooth, and carved). Some include glass hookah bases or retail foil boxes. Phase 02 and this task both keep hookah/tobacco merchandise off the public site unless a separate legal review says otherwise. This phase does not grant that review.

Nothing from `photo/` was copied to `public/products`, `public/gallery`, or `public/wholesale`.

## Fields not invented
No prices, dimensions, MOQ, timber species, or stock counts were written. Those values are not in the photos.

## When non-regulated photos exist
Set `public_approved` only on those rows, `price_public` only after a confirmed price, and keep the regulated-name filter in `src/lib/public-catalog.ts`.
