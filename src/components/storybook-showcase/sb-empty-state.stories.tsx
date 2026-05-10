import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbEmptyState, type SbEmptyStateProps } from './sb-empty-state';
import { SbIconInbox } from './sb-icons';

const meta: Meta<typeof SbEmptyState> = {
	title: 'Showcase/Organisms/EmptyState',
	component: SbEmptyState,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		headline: { control: 'text' },
		description: { control: 'text' },
		ctaLabel: { control: 'text' },
	},
	args: {
		headline: 'No invoices yet',
		description: 'Finalized invoices from Flexprice appear here automatically after billing runs.',
		ctaLabel: 'Create invoice',
		onCtaClick: fn(),
		icon: <SbIconInbox className='size-12 text-muted-foreground' />,
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Use **Controls** to reshape copy. **InteractCtaAck** shows an on-page acknowledgement after CTA.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbEmptyState>;

function EmptyWithAck(props: SbEmptyStateProps) {
	const [note, setNote] = useState<string | null>(null);
	return (
		<div className='space-y-4'>
			<SbEmptyState
				{...props}
				onCtaClick={() => {
					props.onCtaClick?.();
					setNote('Invoice draft shell ready — continue in the full app.');
				}}
			/>
			{note ? (
				<p role='status' aria-live='polite' className='text-sm font-medium text-foreground'>
					{note}
				</p>
			) : null}
		</div>
	);
}

export const Default: Story = {
	render: (args) => <SbEmptyState {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-3xl flex-col gap-10'>
			<SbEmptyState
				headline='No invoices yet'
				description='Finalized invoices from Flexprice appear here automatically after billing runs.'
				ctaLabel='Create invoice'
				onCtaClick={() => {}}
				icon={<SbIconInbox className='size-12 text-muted-foreground' />}
			/>
			<SbEmptyState headline='Nothing matched your filters' description='' />
		</div>
	),
};

export const InteractCtaAck: Story = {
	render: (args) => <EmptyWithAck {...args} icon={args.icon} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /create invoice/i }));
		await expect(args.onCtaClick).toHaveBeenCalled();
		await expect(await canvas.findByRole('status')).toHaveTextContent(/draft shell ready/i);
	},
};
