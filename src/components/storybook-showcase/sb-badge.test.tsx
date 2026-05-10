import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SbBadge } from './sb-badge';

describe('SbBadge', () => {
	it('renders child text', () => {
		render(<SbBadge>New</SbBadge>);
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('merges custom className onto the badge', () => {
		const { container } = render(<SbBadge className='custom-badge-test'>Tagged</SbBadge>);
		expect(container.firstChild).toHaveClass('custom-badge-test');
		expect(screen.getByText('Tagged')).toBeInTheDocument();
	});
});
