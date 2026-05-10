import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SbInput } from './sb-input';

describe('SbInput', () => {
	it('associates label text with the input via htmlFor / id', () => {
		render(<SbInput label='Customer name' placeholder='Acme' />);
		const input = screen.getByRole('textbox', { name: /customer name/i });
		expect(input).toHaveAttribute('placeholder', 'Acme');
	});

	it('shows error copy when error is set', () => {
		render(<SbInput label='Amount' error='Must be positive' defaultValue='0' />);
		expect(screen.getByText(/must be positive/i)).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
	});
});
