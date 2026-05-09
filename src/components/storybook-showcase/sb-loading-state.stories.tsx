import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
import { SbLoadingState } from './sb-loading-state';

const meta: Meta<typeof SbLoadingState> = {
	title: 'Showcase/Atoms/LoadingState',
	component: SbLoadingState,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbLoadingState>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-col gap-6'>
			<div className='rounded-md border border-dashed border-muted-foreground/30 p-2'>
				<p className='mb-2 text-xs text-muted-foreground'>Contained</p>
				<SbLoadingState />
			</div>
			<div className='min-h-[320px] rounded-md border border-dashed border-muted-foreground/30 p-2'>
				<p className='mb-2 text-xs text-muted-foreground'>Tall viewport</p>
				<SbLoadingState />
			</div>
		</div>
	),
};
