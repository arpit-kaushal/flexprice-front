import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
import { SbSpinner } from './sb-spinner';

const meta: Meta<typeof SbSpinner> = {
	title: 'Showcase/Atoms/Spinner',
	component: SbSpinner,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { size: { control: { type: 'range', min: 12, max: 56, step: 2 } }, className: { control: 'text' } },
	args: { size: 24, className: 'text-primary' },
};

export default meta;
type Story = StoryObj<typeof SbSpinner>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-col gap-6'>
			<div className='flex items-end gap-4 text-muted-foreground'>
				<SbSpinner size={16} />
				<SbSpinner size={24} />
				<SbSpinner size={40} />
			</div>
			<div className='flex items-end gap-4 rounded-md bg-primary p-6'>
				<SbSpinner size={28} className='text-primary-foreground' />
				<SbSpinner size={28} className='text-primary-foreground/70' />
			</div>
		</div>
	),
};
