import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SbEmptyState } from './sb-empty-state';

describe('SbEmptyState', () => {
	it('renders headline and description', () => {
		render(<SbEmptyState headline='No invoices yet' description='Create one to get started.' />);
		expect(screen.getByRole('heading', { level: 2, name: /no invoices yet/i })).toBeInTheDocument();
		expect(screen.getByText(/create one to get started/i)).toBeInTheDocument();
	});

	it('renders CTA and invokes handler on click', async () => {
		const user = userEvent.setup();
		const onCta = vi.fn();
		render(<SbEmptyState headline='Nothing here' ctaLabel='Add row' onCtaClick={onCta} />);
		await user.click(screen.getByRole('button', { name: /add row/i }));
		expect(onCta).toHaveBeenCalledTimes(1);
	});
});
