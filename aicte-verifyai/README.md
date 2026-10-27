\# SHAKSHAYA-AI

TEAM: Strata Sense | SIH 2026 | PS ID: 26261



\*\*AI flags. Evidence proves. Officials decide.\*\*



SHAKSHAYA-AI is an AI-powered document validation platform designed to support AICTE regulatory compliance review.



\## Key Features



\- OCR-based document text extraction

\- Missing document detection

\- Cross-document mismatch identification

\- Evidence-based compliance reporting

\- Human review for final decisions



\## Technology Stack



\- React

\- TypeScript

\- Vite

\- Tesseract.js



\## Run Locally



Prerequisite: Node.js and npm.



```bash

npm install --legacy-peer-deps

npm run dev

```



\## Available Checks



```bash

npm run lint

npm test

npm run build

```



\## Privacy and Security



Tesseract.js downloads its worker and model assets when first used, but OCR processing itself remains local in the browser. This repository does not connect to an issuer API or application backend.



The `GEMINI\_API\_KEY` in `.env.example` is reserved for a future server-side integration. Never expose real API keys in frontend source code or client-side environment variables.



\## Project Information



\- Team: Strata Sense

\- SIH 2026 Problem Statement ID: 26261



\## Disclaimer



Automated flags support document review; they do not establish fraud or replace decisions by authorized officials.



