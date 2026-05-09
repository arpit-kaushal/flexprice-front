import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
import { SbProgress } from './sb-progress';

const meta: Meta<typeof SbProgress> = {
	title: 'Showcase/Atoms/Progress',
	component: SbProgress,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
	args: { value: 45, label: 'Seat usage' },
	parameters: { layout: 'padded' },
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
