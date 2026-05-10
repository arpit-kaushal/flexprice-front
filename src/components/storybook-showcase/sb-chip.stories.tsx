import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbChip } from './sb-chip';
import { SbIconArchive, SbIconPauseCircle } from './sb-icons';
import { StoryFeedbackSlot } from './story-interaction-helpers';

const meta: Meta<typeof SbChip> = {
	title: 'Showcase/Atoms/Chip',
	component: SbChip,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		variant: { control: 'select', options: ['default', 'success', 'warning', 'failed', 'info'] },
		disabled: { control: 'boolean' },
		label: { control: 'text' },
	},
	args: {
		label: 'Active',
		variant: 'success',
		disabled: false,
	},
	parameters: {
		docs: {
			description: {
				component:
					'Filter / status chip implemented as a `<button>`. **InteractRemovesFilter** pairs the chip with an on-screen acknowledgement banner.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbChip>;

export const Default: Story = {
	render: (args) => <SbChip {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-2xl flex-col gap-4'>
			<div className='flex flex-wrap gap-2'>
				<SbChip label='Active' variant='success' />
				<SbChip label='Archived' variant='default' icon={<SbIconArchive className='size-3.5' />} />
				<SbChip label='Draft' variant='default' />
				<SbChip label='Paid' variant='success' />
				<SbChip label='Void' variant='default' />
				<SbChip label='Paused' variant='warning' icon={<SbIconPauseCircle className='size-3.5' />} />
				<SbChip label='Failed' variant='failed' />
				<SbChip label='Scheduled' variant='info' />
			</div>
			<div className='flex flex-wrap gap-2 border-t pt-4'>
				<SbChip label='Disabled' variant='success' disabled />
			</div>
		</div>
	),
};

export const InteractRemovesFilter: Story = {
	args: { label: 'Status: Active', variant: 'success' },
	render: (args) => (
		<StoryFeedbackSlot
			confirmPrefix='Filter cleared'
			hintText='Activate the chip — a confirmation replaces this hint.'
			trigger={<SbChip {...args} />}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /status: active/i }));
		await expect(await canvas.findByRole('status')).toHaveTextContent(/Filter cleared/);
	},
};
