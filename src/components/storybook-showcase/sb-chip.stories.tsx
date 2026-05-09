import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbChip } from './sb-chip';
import { SbIconArchive, SbIconPauseCircle } from './sb-icons';

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
	args: { label: 'Active', variant: 'success' },
};

export default meta;
type Story = StoryObj<typeof SbChip>;

export const Default: Story = {};

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

export const InteractiveChip: Story = {
	args: { label: 'Remove filter', variant: 'default', onClick: fn() },
	render: (args) => <SbChip {...args} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByRole('button', { name: /remove filter/i });
		chip.focus();
		await userEvent.keyboard('{Enter}');
		await expect(args.onClick).toHaveBeenCalled();
	},
};
