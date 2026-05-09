import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbEmptyState } from './sb-empty-state';
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
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbEmptyState>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /create invoice/i }));
		await expect(args.onCtaClick).toHaveBeenCalled();
	},
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
