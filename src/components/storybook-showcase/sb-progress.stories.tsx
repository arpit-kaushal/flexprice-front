import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbProgress } from './sb-progress';

const meta: Meta<typeof SbProgress> = {
	title: 'Showcase/Atoms/Progress',
	component: SbProgress,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
	args: { value: 45, label: 'Seat usage' },
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Meters with Radix progress + token tracks. **InteractBoost** simulates usage growth with an on-screen percent readout.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbProgress>;

export const Default: Story = {
	render: (args) => (
		<div className='mx-auto w-full max-w-md'>
			<SbProgress {...args} />
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex w-full max-w-md flex-col gap-6'>
			<SbProgress value={20} label='Primary fill' />
			<SbProgress
				value={66}
				indicatorClassName='bg-chart-2'
				trackClassName='bg-muted'
				label={<span className='text-muted-foreground'>Chart-2 accent on muted track</span>}
			/>
			<SbProgress value={100} label='Complete' />
		</div>
	),
};

function ProgressBoostDemo() {
	const [value, setValue] = useState(35);
	return (
		<div className='mx-auto flex w-full max-w-md flex-col gap-4'>
			<SbProgress value={value} label={`Committed units · ${value}%`} />
			<div className='flex flex-wrap gap-2'>
				<SbButton type='button' size='sm' variant='outline' onClick={() => setValue((v) => Math.min(100, v + 15))}>
					Add 15% usage
				</SbButton>
				<SbButton type='button' size='sm' variant='ghost' onClick={() => setValue(0)}>
					Reset
				</SbButton>
			</div>
			<p className='text-sm text-muted-foreground' aria-live='polite' role='status' data-testid='progress-meter-readout'>
				Latest reading: <strong>{value}%</strong>
			</p>
		</div>
	);
}

export const InteractBoost: Story = {
	render: () => <ProgressBoostDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('progress-meter-readout')).toHaveTextContent('35%');
		await userEvent.click(canvas.getByRole('button', { name: /add 15%/i }));
		await expect(canvas.getByTestId('progress-meter-readout')).toHaveTextContent('50%');
	},
};
