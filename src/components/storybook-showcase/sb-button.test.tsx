import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SbButton } from './sb-button';

describe('SbButton', () => {
	it('renders children as an accessible button', () => {
		render(<SbButton type='button'>Save draft</SbButton>);
		expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
	});

	it('disables the control while loading', () => {
		render(
			<SbButton type='button' isLoading>
				Submit
			</SbButton>,
		);
		const btn = screen.getByRole('button', { name: /submit/i });
		expect(btn).toBeDisabled();
	});
});
