import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbDateRangePicker } from './sb-date-range-picker';

const meta: Meta<typeof SbDateRangePicker> = {
	title: 'Showcase/Molecules/DateRangePicker',
	component: SbDateRangePicker,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	args: { placeholder: 'Select billing window', disabled: false },
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbDateRangePicker>;

export const Default: Story = {
	render: (args) => <SbDateRangePicker {...args} onChange={() => {}} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-2xl flex-col gap-8'>
			<div>
				<p className='mb-2 text-xs text-muted-foreground'>Enabled</p>
				<SbDateRangePicker title='Reporting period' onChange={() => {}} />
			</div>
			<div>
				<p className='mb-2 text-xs text-muted-foreground'>Disabled</p>
				<SbDateRangePicker disabled title='Locked period' onChange={() => {}} />
			</div>
		</div>
	),
};

export const FocusStartDate: Story = {
	render: () => <SbDateRangePicker title='Reporting period' onChange={() => {}} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const start = canvas.getByLabelText('Start');
		await userEvent.click(start);
		await expect(start).toHaveFocus();
	},
};
