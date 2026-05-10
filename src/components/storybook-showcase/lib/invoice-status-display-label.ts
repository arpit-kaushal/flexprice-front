export const SB_INVOICE_STATUS_CODES = {
	DRAFT: 'DRAFT',
	FINALIZED: 'FINALIZED',
	VOIDED: 'VOIDED',
	SKIPPED: 'SKIPPED',
} as const;

export type SbInvoiceBadgeStatus = (typeof SB_INVOICE_STATUS_CODES)[keyof typeof SB_INVOICE_STATUS_CODES] | 'PAID' | string;

export function getInvoiceStatusDisplayLabel(status: SbInvoiceBadgeStatus): string {
	const key = status?.toUpperCase?.() ?? '';
	switch (key) {
		case SB_INVOICE_STATUS_CODES.VOIDED:
			return 'Void';
		case SB_INVOICE_STATUS_CODES.FINALIZED:
			return 'Finalized';
		case SB_INVOICE_STATUS_CODES.DRAFT:
			return 'Draft';
		case SB_INVOICE_STATUS_CODES.SKIPPED:
			return 'Skipped';
		case 'PAID':
			return 'Paid';
		default:
			return status ? String(status) : 'Unknown';
	}
}
