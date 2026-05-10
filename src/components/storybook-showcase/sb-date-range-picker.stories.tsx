import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbDateRangePicker } from './sb-date-range-picker';

const meta: Meta<typeof SbDateRangePicker> = {
	title: 'Showcase/Molecules/DateRangePicker',
	component: SbDateRangePicker,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		title: { control: 'text' },
		placeholder: { control: 'text' },
		disabled: { control: 'boolean' },
		startDate: { control: 'text' },
		endDate: { control: 'text' },
	},
	args: { placeholder: 'Select billing window', disabled: false, title: 'Reporting period' },
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Native browser date pair for filters. **InteractEcho** mirrors selection into a summary line for reviewers.',
			},
		},
	},
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

function RangeEcho() {
	const [summary, setSummary] = useState('Pick start and end dates.');
	return (
		<div className='max-w-xl space-y-4'>
			<SbDateRangePicker title='Billing cycle' onChange={(r) => setSummary(`${r.startDate ?? '—'}→${r.endDate ?? '—'}`)} />
			<p className='font-mono text-xs text-foreground' role='status' aria-live='polite' data-testid='range-summary'>
				{summary}
			</p>
		</div>
	);
}

export const InteractEcho: Story = {
	render: () => <RangeEcho />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const start = canvas.getByLabelText(/billing cycle start/i);
		const end = canvas.getByLabelText(/billing cycle end/i);
		await userEvent.clear(start);
		await userEvent.type(start, '2026-06-01');
		await userEvent.clear(end);
		await userEvent.type(end, '2026-06-30');
		await expect(await canvas.findByTestId('range-summary')).toHaveTextContent(/2026-06-01/);
	},
};

export const FocusStartDate: Story = {
	render: () => <SbDateRangePicker title='Reporting period' onChange={() => {}} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const start = canvas.getByLabelText(/reporting period start/i);
		await userEvent.click(start);
		await expect(start).toHaveFocus();
	},
};
