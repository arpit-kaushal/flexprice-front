import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbInvoiceStatusBadge } from './sb-invoice-status-badge';

const meta: Meta<typeof SbInvoiceStatusBadge> = {
	title: 'Showcase/Molecules/InvoiceStatusBadge',
	component: SbInvoiceStatusBadge,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { status: { control: 'text' } },
	args: { status: 'DRAFT' },
};

export default meta;
type Story = StoryObj<typeof SbInvoiceStatusBadge>;

export const Default: Story = {};

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

export const StatusLabel: Story = {
	args: { status: 'FINALIZED' },
	render: (args) => <SbInvoiceStatusBadge {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(/finalized/i)).toBeVisible();
	},
};
