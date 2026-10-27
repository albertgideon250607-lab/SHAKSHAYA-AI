# Implementation Progress

Updated: 2026-10-25

## Completed in this iteration

- Removed the landing-page demo bypass; users must sign in before entering the portal.
- Added local manual document intake for PDF, PNG, JPEG, and WebP files.
- Added a 10 MB per-file client-side restriction.
- Added SHA-256 hashes for uploaded files using the browser Web Crypto API.
- Added duplicate-file findings for byte-identical files attached to multiple categories in one application.
- Added browser-local Tesseract.js OCR for PNG/JPEG/WebP and PDF.js rendering for up to five PDF pages per run.
- Added OCR progress, cancellation, retry/error states, extracted text review, field editing, and revalidation.
- Removed uploaded OCR text and fields from localStorage serialization; uploaded originals remain available only in the current browser session.
- Replaced the fabricated nationwide “unique asset” result with an honest local-only duplicate result and an explicit backend-integration limitation.
- Removed the fabricated report integrity fingerprint and replaced it with a truthful uploaded-file hash availability notice.
- Preserved synthetic demo data as a clearly labelled demonstration workflow.

## Current gaps

The repository is a Vite/React frontend and does not contain a backend, database, ORM, migration system, OCR service, Gemini server integration, issuer API client, or server-side authorization layer. Therefore the following remain unverified or unavailable:

- Persistent multi-user application/document storage and secure document access.
- Server-side authentication, sessions, RBAC enforcement, rate limiting, and tenant isolation.
- Server-backed document persistence and correction history.
- OCR model assets are fetched on first use; an offline-first packaged model is not included.
- Cross-application duplicate detection and GIS/issuer verification.
- Real issuer verification statuses and official API responses.
- Reviewer assignment, additional-document requests, and a persisted status history.
- Tamper-evident audit storage.

The UI must not represent these unavailable integrations as completed verification. Regulatory requirements should be confirmed against official AICTE guidance before production use.

## Environment and setup

- Node.js is required.
- Install with `npm install --legacy-peer-deps` because the current Vite/esbuild manifests have a peer-version conflict.
- Run with `npm run dev`.
- `GEMINI_API_KEY` is documented only as a future server-side integration secret; it is not used by the current frontend.

## Validation results

- `npm run lint`: passed
- `npm run build`: passed
- `npm test`: passed (16 tests)
