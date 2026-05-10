import { describe, expect, it } from 'vitest';
import { getInvoiceStatusDisplayLabel } from './invoice-status-display-label';

describe('getInvoiceStatusDisplayLabel (invoice API code → badge text)', () => {
	it('maps known lifecycle codes case-insensitively', () => {
		expect(getInvoiceStatusDisplayLabel('voided')).toBe('Void');
		expect(getInvoiceStatusDisplayLabel('FINALIZED')).toBe('Finalized');
		expect(getInvoiceStatusDisplayLabel('Draft')).toBe('Draft');
		expect(getInvoiceStatusDisplayLabel('skipped')).toBe('Skipped');
		expect(getInvoiceStatusDisplayLabel('paid')).toBe('Paid');
	});

	it('falls back to the raw code or Unknown', () => {
		expect(getInvoiceStatusDisplayLabel('SENT_TO_ERP')).toBe('SENT_TO_ERP');
		expect(getInvoiceStatusDisplayLabel('')).toBe('Unknown');
	});
});
