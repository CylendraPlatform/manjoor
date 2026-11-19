# Phase 02 — Sales-first product strategy

MANJOOR’s near-term job is to bring buyers to the Karbala workshop: show approved woodcraft, take quantity-based quotation requests, and let staff follow up. Manufacturing planning, accounting, warehouse automation, affiliates, and AI sales stay deferred.

## Two surfaces

- **Public site** (`VITE_ENABLE_PUBLIC_SITE`, default off): homepage, catalog, wholesale, custom orders, contact, quote request.
- **Internal sales workspace**: `/admin/leads` once the isolated database has the lead migration. Existing admin order tools remain; they are not the priority.

Direct purchase stays on `VITE_ENABLE_PUBLIC_SALES` and is not turned on by this phase.

## What may be shown

Only products with `public_approved = true`, active, and not matching hookah/tobacco terms. Prices appear only when `price_public = true`. Missing photos, phone numbers, history, and capacity figures stay unlabeled or omitted. Placeholders are marked as waiting for approved media.

## Dependency

Phase 01 PR #1 (`feat/manjoor-phase01-stabilization`) is still open. This work is on `feat/manjoor-public-sales-platform`, stacked on that branch. PR #1 is not modified.
