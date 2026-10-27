# Runtime Validation Report — Shakshya AI

**Generated**: 2026-10-25T12:17:00+05:30  
**Target**: `C:\Users\ADMIN\Downloads\AeroGrid_AI_Arduino_Demo_Improved\aicte-verifyai`  
**Problem Statement**: Smart India Hackathon (SIH) — PS 26261  
**Project**: Shakshya AI — Approval Readiness Portal

---

## 1. Executive Summary

| Component | Status | Evidence | Notes |
|---|---|---|---|
| Startup & Dev Server | PASS | HTTP 200 on `localhost:5173/` | Vite dev server running stably |
| Unit Test Suite | PASS | 12 tests passed, 0 failed (Vitest) | Covers rules, presence, mismatches, admin persistence, snapshot diffing, and demo state |
| Production Build | PASS | `npm run build` exited with code 0 | TypeScript compilation & Vite bundle complete |
| Sample PDF Generation | PASS | 7 valid text-based PDFs in `public/sample-documents/` | All served with HTTP 200 `application/pdf` |
| UI Redesign | PASS | Executive government-tech styling | Dark navy sidebar `#102B5C`, royal blue `#2463EB`, cards `#FFFFFF`, responsive layouts |
| One-Click Demo | PASS | `DEMO-EOA-001` workflow connected | Instant demo initialization, sample dataset loading, and safe reset |
| Admin Rule Connection | PASS | Rules feed active validator | Enabled/disabled toggles update validation runs immediately |
| Click-to-Evidence | PASS | Document viewer with snippet highlights | Real text inspection, source page indicator, Open Original PDF |
| Rectification Diffing | PASS | Real before/after snapshot comparison | Identifies resolved, unresolved, and newly detected findings |
| Officer Scrutiny | PASS | Statutory decisions and audit trail | Decision recording, note requirements, and multi-page PDF report download |

**Overall Status**: **READY FOR HACKATHON DEMO & EVALUATION**

---

## 2. Test Evidence Log

### A. Vitest Unit & Integration Tests (`npm test`)
```
 RUN  v2.1.9 C:/Users/ADMIN/Downloads/AeroGrid_AI_Arduino_Demo_Improved/aicte-verifyai

 ✓ src/validation/rules.test.ts (12 tests) 168ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Duration  1.20s
```

Test cases verified:
1. `passes a synthetic document containing all configured required fields`
2. `returns a failed check when a synthetic document misses a configured field`
3. `flags conflicting institution names across synthetic documents for human review`
4. `does not flag cross-document mismatches when institution names match`
5. `RULE DEMO-EoA-001: flags missing mandatory category in document checklist`
6. `returns Not verified honest status when document has no extractable text layer`
7. `persists and enforces custom admin rules by enabling/disabling`
8. `calculates honest prototype readiness score based on documented formula`
9. `correctly maps statusFromFindings`
10. `demo initialisation and reset preserves unrelated applications while resetting DEMO-EOA-001`
11. `loadSampleMatchingSetIntoApp loads matching sample PDFs and produces valid findings`
12. `loadSampleMismatchSetIntoApp flags RULE DEMO-EoA-002 for differing institution names`

### B. Production Build (`npm run build`)
```
> aicte-verifyai@0.1.0 build
> tsc -b && vite build

vite v6.4.5 building for production...
transforming...
✓ 1815 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                              0.46 kB │ gzip:   0.30 kB
dist/assets/pdf.worker.min-yatZIOMy.mjs  1,375.84 kB
dist/assets/index-B2I6ldXh.css              24.31 kB │ gzip:   5.51 kB
dist/assets/purify.es-BwoZCkIS.js           22.03 kB │ gzip:   8.77 kB
dist/assets/index.es-DIe0Gn5z.js           159.74 kB │ gzip:  53.54 kB
dist/assets/html2canvas.esm-QH1iLAAe.js    202.38 kB │ gzip:  48.04 kB
dist/assets/index-D1uDJdgb.js            1,021.69 kB │ gzip: 313.24 kB
✓ built in 11.52s
```

### C. Sample Documents Verification (`public/sample-documents/`)
- `affidavit-2-matching.pdf` (6.5 KB) — HTTP 200 application/pdf
- `ter-receipt-matching.pdf` (6.4 KB) — HTTP 200 application/pdf
- `fire-safety-matching.pdf` (6.3 KB) — HTTP 200 application/pdf
- `building-license-matching.pdf` (6.2 KB) — HTTP 200 application/pdf
- `satellite-map-sample.pdf` (5.9 KB) — HTTP 200 application/pdf
- `ter-receipt-mismatch.pdf` (6.2 KB) — HTTP 200 application/pdf
- `scanned-ocr-sample.pdf` (3.9 KB) — HTTP 200 application/pdf

---

## 3. Demo Limitations & Honest Fallbacks

1. **Scanned Documents (OCR)**: Scanned image-only PDFs without a text layer are honestly flagged as `"OCR required — text extraction unavailable."` Bounding boxes and OCR text coordinates are not fabricated.
2. **Local Session Scope**: Application metadata and officer determinations persist in the browser's `LocalStorage`. Real-time multi-user synchronisation or external server databases are not simulated.
3. **Regulatory Handbooks**: Prototype rules evaluate verified demo patterns. Official APH clause legal conclusions are subject to authorized human scrutiny.
