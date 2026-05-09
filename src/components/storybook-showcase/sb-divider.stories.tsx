import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
import { SbDivider } from './sb-divider';

const meta: Meta<typeof SbDivider> = {
	title: 'Showcase/Atoms/Divider',
	component: SbDivider,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		width: { control: 'text' },
		alignment: { control: 'select', options: ['left', 'center', 'right'] },
		color: { control: 'text' },
	},
	args: { width: '100%', alignment: 'center', color: 'hsl(var(--border))' },
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbDivider>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex w-full max-w-md flex-col gap-8 py-4'>
			<div>
				<p className='mb-2 text-xs text-muted-foreground'>Center · token border</p>
				<SbDivider color='hsl(var(--border))' alignment='center' />
			</div>
			<div>
				<p className='mb-2 text-xs text-muted-foreground'>Left · 60% width</p>
				<SbDivider color='hsl(var(--border))' alignment='left' width='60%' />
			</div>
			<div>
				<p className='mb-2 text-xs text-muted-foreground'>Right · half width</p>
				<SbDivider color='hsl(var(--border))' alignment='right' width='50%' />
			</div>
		</div>
	),
};
