import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
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
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Token-colored horizontal rules. **InteractCycleAlignment** proves layout changes are visible.',
			},
		},
	},
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

function DividerCycleDemo() {
	const order = ['center', 'left', 'right'] as const;
	const [i, setI] = useState(0);
	const alignment = order[i % order.length]!;
	const label = alignment.toUpperCase();
	return (
		<div className='mx-auto max-w-md space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setI((v) => v + 1)}>
				Cycle alignment
			</SbButton>
			<p className='text-sm font-semibold tabular-nums' role='status' aria-live='polite'>
				Alignment: <span data-testid='divider-flag'>{label}</span>
			</p>
			<SbDivider alignment={alignment} width={alignment === 'center' ? '100%' : '70%'} />
		</div>
	);
}

export const InteractCycleAlignment: Story = {
	render: () => <DividerCycleDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('divider-flag')).toHaveTextContent('CENTER');
		await userEvent.click(canvas.getByRole('button', { name: /cycle alignment/i }));
		await expect(canvas.getByTestId('divider-flag')).toHaveTextContent('LEFT');
	},
};
