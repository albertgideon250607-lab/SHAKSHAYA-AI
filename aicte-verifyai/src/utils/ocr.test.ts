import { describe, expect, it } from 'vitest';
import { extractFieldsFromOcrText, isSupportedOcrFile } from './ocr';

describe('browser OCR helpers', () => {
  it('accepts supported image and PDF types within the upload limit', () => {
    expect(isSupportedOcrFile({ type: 'image/png', size: 1024 })).toBe(true);
    expect(isSupportedOcrFile({ type: 'image/jpeg', size: 1024 })).toBe(true);
    expect(isSupportedOcrFile({ type: 'image/webp', size: 1024 })).toBe(true);
    expect(isSupportedOcrFile({ type: 'application/pdf', size: 10 * 1024 * 1024 })).toBe(true);
  });

  it('rejects unsupported types and oversized files', () => {
    expect(isSupportedOcrFile({ type: 'text/plain', size: 1024 })).toBe(false);
    expect(isSupportedOcrFile({ type: 'image/png', size: 10 * 1024 * 1024 + 1 })).toBe(false);
  });

  it('extracts only fields supported by visible OCR labels', () => {
    const fields = extractFieldsFromOcrText(
      'Institution Name: Example Institute\nApplication ID: APP-2026-001\nAcademic Year: 2026-27\nNOC Ref: FIRE/2026/22'
    );

    expect(fields.institutionName).toBe('Example Institute');
    expect(fields.applicationId).toBe('APP-2026-001');
    expect(fields.academicYear).toBe('2026-27');
    expect(fields.nocNumber).toBe('FIRE/2026/22');
    expect(fields.amountPaid).toBeUndefined();
  });
});
