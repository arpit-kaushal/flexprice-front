import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbInvoiceStatusBadge } from './sb-invoice-status-badge';

const meta: Meta<typeof SbInvoiceStatusBadge> = {
	title: 'Showcase/Molecules/InvoiceStatusBadge',
	component: SbInvoiceStatusBadge,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { status: { control: 'text' } },
	args: { status: 'DRAFT' },
	parameters: {
		docs: {
			description: {
				component: 'Non-interactive badges. **InteractCycle** syncs a picker to show label changes in-place.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbInvoiceStatusBadge>;

export const Default: Story = {
	render: (args) => <SbInvoiceStatusBadge {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2'>
			<SbInvoiceStatusBadge status='DRAFT' />
			<SbInvoiceStatusBadge status='FINALIZED' />
			<SbInvoiceStatusBadge status='VOIDED' />
			<SbInvoiceStatusBadge status='SKIPPED' />
			<SbInvoiceStatusBadge status='PAID' />
			<SbInvoiceStatusBadge status='UNKNOWN_STUB' />
		</div>
	),
};

const cycle = ['DRAFT', 'FINALIZED', 'PAID', 'VOIDED'] as const;

function CycleStatusesDemo() {
	const [i, setI] = useState(0);
	const status = cycle[i % cycle.length];
	return (
		<div className='space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setI((v) => v + 1)}>
				Next invoice state
			</SbButton>
			<SbInvoiceStatusBadge status={status} />
			<p className='text-sm text-muted-foreground' aria-live='polite' role='status' data-testid='status-slug'>
				Editor showing: <strong>{status}</strong>
			</p>
		</div>
	);
}

export const InteractCycle: Story = {
	render: () => <CycleStatusesDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('status-slug')).toHaveTextContent(/DRAFT/);
		await userEvent.click(canvas.getByRole('button', { name: /next invoice state/i }));
		await expect(canvas.getByTestId('status-slug')).toHaveTextContent(/FINALIZED/);
	},
};
