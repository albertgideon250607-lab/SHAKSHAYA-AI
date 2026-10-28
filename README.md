# Shakshya AI

**AI flags. Evidence proves. Officials decide.**

Evidence-linked validation of AICTE Extension of Approval (EoA) applications.
Smart India Hackathon 2026 · Problem Statement **26261** · Team **Strata Sense**

> **Prototype for demonstration only. Not an official AICTE product.** All demo data is synthetic.

## Overview

Institutions upload the documents required for an EoA application. Shakshya AI checks them against an APH-based checklist, shows **where** each issue was found in the document, and leaves the final decision with an authorized official.

## Features

- **7-document EoA checklist** based on the AICTE Approval Process Handbook
- **Upload and processing** of PDF documents with text extraction
- **Validation results** with severity and rule ID for each finding
- **Evidence Inspector:** extracted text snippet, source file and page, recommended remediation, source PDF download
- **Cross-document checks**, for example institution name mismatch between a TER receipt and the application record
- **Readiness score** shown before submission
- **Rectify and re-upload** with before/after comparison (for example 78% to 92%)
- **PDF compliance report** download
- **Three role-based portals:** Institution, Scrutiny Officer, Administrator
- **Officer determination** with mandatory remarks (Recommend Approval, Show Cause / Rectify, Reject), recorded in an audit trail
- **One-click demo** with sample institution `DEMO-EOA-001` and a safe reset

## Screenshots

| Evidence Inspector | Rectification (before/after) | Officer determination |
|---|---|---|
| ![Evidence](docs/screenshots/evidence-inspector.png) | ![Rectify](docs/screenshots/rectification.png) | ![Officer](docs/screenshots/officer-determination.png) |

## How it works

1. Institution views the 7-document checklist and uploads documents
2. Text is extracted from each document
3. Validation rules check missing, expired and mismatched information
4. Findings are shown with evidence and a readiness score
5. Institution rectifies flagged documents and re-uploads
6. Scrutiny Officer reviews findings and records the determination
7. Report is exported and actions are logged

## Tech stack

React · TypeScript · Vite · pdf.js · jsPDF · Vitest

## Getting started

Requires Node.js 18 or later.

```bash
git clone https://github.com/albertgideon250607-lab/SHAKSHAYA-AI.git
cd SHAKSHAYA-AI/aicte-verifyai
npm install
npm run dev
```

Open the local URL shown in the terminal and choose **Try One-Click Demo**.
If `npm install` reports a peer dependency error, run `npm install --legacy-peer-deps`.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm test` | Run unit tests (Vitest) |
| `npm run build` | Type-check and build for production |
| `npm run generate:samples` | Generate synthetic sample PDFs |

## Responsible AI and limitations

- Findings are **preliminary indicators**, not proof of forgery or non-compliance
- The system **does not approve or reject** applications; officials record the final determination
- Scanned documents without a text layer are flagged **"OCR required"** and routed to manual review instead of being guessed
- Issuer and AICTE database verification is **not implemented**; real integrations would need authorization
- Application data and officer determinations are stored in the browser (LocalStorage); there is no shared backend
- The prototype covers the **EoA (self-disclosure)** workflow only, using synthetic documents

## Roadmap

- Rules mapped to specific APH clauses, reviewed against the handbook
- Authorized issuer verification (APIs, QR, digital signature)
- OCR for scanned documents
- Secure backend with controlled document storage
- Benchmark on a larger synthetic test set

## References

- AICTE Approval Process Handbook (APH) 2024-25 to 2026-27, [aicte.gov.in](https://www.aicte.gov.in)
- AICTE Public Notice for Approval Process 2026-27, Advt. No. AICTE/Regulation Bureau-AP/2026-27 dated 26/11/2025
- LayoutLMv3, [arXiv:2204.08387](https://arxiv.org/abs/2204.08387)
- AIForge-Doc, [arXiv:2602.20569](https://arxiv.org/abs/2602.20569)
- NLP-based Automated Compliance Checking against GDPR, [arXiv:2209.09722](https://arxiv.org/abs/2209.09722)

## Team

**Strata Sense** · Smart India Hackathon 2026 · PS 26261

## Disclaimer

Prototype created for Smart India Hackathon 2026. Not affiliated with or endorsed by AICTE. All institutions, documents and people in the demo are fictional. Findings are preliminary and must be verified by authorized officials.
