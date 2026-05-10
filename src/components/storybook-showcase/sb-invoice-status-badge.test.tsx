import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SbInvoiceStatusBadge } from './sb-invoice-status-badge';

describe('SbInvoiceStatusBadge', () => {
	it('renders void and paid labels', () => {
		const { rerender } = render(<SbInvoiceStatusBadge status='VOIDED' />);
		expect(screen.getByText('Void')).toBeInTheDocument();
		rerender(<SbInvoiceStatusBadge status='PAID' />);
		expect(screen.getByText('Paid')).toBeInTheDocument();
	});
});
