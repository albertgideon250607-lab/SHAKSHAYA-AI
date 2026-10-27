<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Shakshya AI

Shakshya AI — Intelligent Document Verification and Regulatory Compliance Platform. Every Document. Verified with Intelligence.

Shakshya AI is a frontend prototype for assistive EoA application readiness review. It preserves a human-in-the-loop workflow: automated findings are preliminary and do not constitute issuer verification or an approval decision.

## Current implementation

- Role-based prototype sign-in for institution, scrutiny officer, and administrator views.
- Configurable deterministic validation rules for the synthetic EoA workflow.
- Manual local document intake for PDF, PNG, JPEG, and WebP files (10 MB limit).
- Browser-local OCR using Tesseract.js for images and PDF.js-rendered PDF pages (up to 5 pages per OCR run).
- Browser-side SHA-256 hashing and duplicate-file warnings within an application.
- Synthetic sample workflow for demonstrating extraction and cross-document findings.
- PDF report generation and local audit history.

Manual uploads are retained in browser memory for the current session. OCR runs in the browser; documents are not sent to an application backend. Tesseract.js downloads its worker/model assets when first used, but OCR processing itself remains local. No issuer API or database is connected in this repository.

## Run locally

Prerequisite: Node.js

```bash
npm install --legacy-peer-deps
npm run dev
```

Available checks:

```bash
npm run lint
npm test
npm run build
```

The `GEMINI_API_KEY` in `.env.example` is reserved for a future server-side integration. Do not place real API keys in frontend source or client-exposed environment variables.
