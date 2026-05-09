import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbBadge } from './sb-badge';

const meta: Meta<typeof SbBadge> = {
	title: 'Showcase/Atoms/Badge',
	component: SbBadge,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
	},
	args: { children: 'Beta', variant: 'default' },
};

export default meta;
type Story = StoryObj<typeof SbBadge>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2'>
			<SbBadge>Default</SbBadge>
			<SbBadge variant='secondary'>Secondary</SbBadge>
			<SbBadge variant='destructive'>Destructive</SbBadge>
			<SbBadge variant='outline'>Outline</SbBadge>
		</div>
	),
};

export const RendersChildren: Story = {
	args: { children: 'Environment: production' },
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(String(args.children))).toBeVisible();
	},
};
