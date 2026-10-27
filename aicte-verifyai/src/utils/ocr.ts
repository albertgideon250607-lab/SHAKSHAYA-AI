import { createWorker, type Worker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_OCR_PAGES = 5;

export interface OcrProgress {
  documentId: string;
  page: number;
  totalPages: number;
  percent: number;
  status: 'loading' | 'processing' | 'completed' | 'cancelled' | 'failed';
  message: string;
}

export interface OcrResult {
  text: string;
  pageCount: number;
  hasTextLayer: boolean;
}

export interface ExtractedFields {
  institutionName?: string;
  applicationId?: string;
  academicYear?: string;
  amountPaid?: string;
  validityPeriod?: string;
  builtUpArea?: string;
  gpsCoordinates?: string;
  deponentName?: string;
  nocNumber?: string;
  [key: string]: string | undefined;
}

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const PDF_TYPE = 'application/pdf';

export function isSupportedOcrFile(file: Pick<File, 'type' | 'size'>): boolean {
  return (file.type === PDF_TYPE || IMAGE_TYPES.has(file.type)) && file.size <= 10 * 1024 * 1024;
}

function ensureSupportedFile(file: File): void {
  if (file.type !== PDF_TYPE && !IMAGE_TYPES.has(file.type)) {
    throw new Error('OCR supports PDF, PNG, JPEG, and WebP files only.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Documents must be 10 MB or smaller.');
  }
}

function extractFirstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return undefined;
}

export function extractFieldsFromOcrText(text: string): ExtractedFields {
  return {
    institutionName: extractFirstMatch(text, [
      /institution\s*name\s*[:\-]\s*(.+)/i,
      /name\s+of\s+(?:the\s+)?institution\s*[:\-]\s*(.+)/i,
    ]),
    applicationId: extractFirstMatch(text, [
      /(?:application|reference|institute)\s*(?:id|number|no\.?)\s*[:\-]\s*([A-Z0-9][A-Z0-9\-\/]+)/i,
    ]),
    academicYear: extractFirstMatch(text, [
      /academic\s+year\s*[:\-]\s*((?:20\d{2})\s*[-\/]\s*(?:(?:20)?\d{2}))/i,
    ]),
    amountPaid: extractFirstMatch(text, [
      /(?:amount|fee|payment)\s*(?:paid|received|₹|rs\.?|inr)?\s*[:\-]?\s*((?:₹|rs\.?|inr)\s*[\d,]+(?:\.\d{1,2})?)/i,
    ]),
    validityPeriod: extractFirstMatch(text, [
      /valid(?:ity)?\s*[:\-]\s*(.+)/i,
      /valid\s+from\s*[:\-]?\s*(.+)/i,
    ]),
    builtUpArea: extractFirstMatch(text, [
      /built[\s-]*up\s+area\s*[:\-]\s*(.+)/i,
    ]),
    gpsCoordinates: extractFirstMatch(text, [
      /(?:gps|coordinates?|latitude|longitude)[^:\n]*[:\-]\s*([0-9]{1,3}(?:\.[0-9]+)?\s*[NS]?\s*,\s*[0-9]{1,3}(?:\.[0-9]+)?\s*[EW]?)/i,
    ]),
    deponentName: extractFirstMatch(text, [
      /deponent\s*(?:name)?\s*[:\-]\s*(.+)/i,
    ]),
    nocNumber: extractFirstMatch(text, [
      /(?:noc|certificate|challan)\s*(?:no\.?|number|ref(?:erence)?)\s*[:\-]\s*([A-Z0-9][A-Z0-9\/\-]+)/i,
    ]),
  };
}

async function recognizeImage(
  worker: Worker,
  image: HTMLCanvasElement | File | Blob,
  onProgress: (value: number) => void
): Promise<string> {
  const result = await worker.recognize(image, {
    rotateAuto: true,
  }, {
    pdf: false,
    tsv: false,
    hocr: false,
    blocks: false,
    debug: false,
  });
  onProgress(100);
  return result.data.text.trim();
}

async function renderPdfPage(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('The browser could not create a canvas for PDF OCR.');
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvas;
}

export async function extractTextWithOcr(
  file: File,
  documentId: string,
  onProgress: (progress: OcrProgress) => void,
  signal?: AbortSignal
): Promise<OcrResult> {
  ensureSupportedFile(file);
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress({
          documentId,
          page: 1,
          totalPages: 1,
          percent: Math.round((message.progress || 0) * 100),
          status: 'processing',
          message: 'Recognizing text...',
        });
      }
    },
  });

  try {
    if (signal?.aborted) throw new DOMException('OCR cancelled.', 'AbortError');

    if (file.type !== PDF_TYPE) {
      onProgress({
        documentId,
        page: 1,
        totalPages: 1,
        percent: 5,
        status: 'processing',
        message: 'Preparing image...',
      });
      const text = await recognizeImage(worker, file, () => undefined);
      if (!text) throw new Error('No readable text was detected in this image.');
      return { text, pageCount: 1, hasTextLayer: false };
    }

    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const totalPages = Math.min(pdf.numPages, MAX_OCR_PAGES);
    const pages: string[] = [];
    for (let page = 1; page <= totalPages; page += 1) {
      if (signal?.aborted) throw new DOMException('OCR cancelled.', 'AbortError');
      onProgress({
        documentId,
        page,
        totalPages,
        percent: Math.round(((page - 1) / totalPages) * 100),
        status: 'processing',
        message: `Rendering and reading page ${page} of ${totalPages}...`,
      });
      const canvas = await renderPdfPage(pdf, page);
      const text = await recognizeImage(worker, canvas, () => undefined);
      if (text) pages.push(`--- Page ${page} ---\n${text}`);
      canvas.width = 1;
      canvas.height = 1;
    }
    const text = pages.join('\n\n').trim();
    if (!text) throw new Error('No readable text was detected in the PDF pages.');
    return { text, pageCount: pdf.numPages, hasTextLayer: false };
  } finally {
    await worker.terminate();
  }
}
