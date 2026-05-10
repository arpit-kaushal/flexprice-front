import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbLoadingState } from './sb-loading-state';

const meta: Meta<typeof SbLoadingState> = {
	title: 'Showcase/Atoms/LoadingState',
	component: SbLoadingState,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Panel blocking state. **InteractMount** toggles it with visible region text (no props on the atom).',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbLoadingState>;

export const Default: Story = {
	render: () => (
		<div className='max-w-xl rounded-md border border-border p-2'>
			<SbLoadingState />
		</div>
	),
};

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

function LoadingToggleDemo() {
	const [busy, setBusy] = useState(true);
	return (
		<div className='max-w-lg space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setBusy((v) => !v)}>
				{busy ? 'Finish loading' : 'Start loading'}
			</SbButton>
			<div className='rounded-md border border-border'>
				{busy ? (
					<div data-testid='loading-shell'>
						<SbLoadingState />
					</div>
				) : (
					<p className='p-6 text-sm text-muted-foreground' role='status' aria-live='polite'>
						Content revealed — loading state removed.
					</p>
				)}
			</div>
		</div>
	);
}

export const InteractMount: Story = {
	render: () => <LoadingToggleDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('loading-shell')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: /finish loading/i }));
		await expect(canvas.queryByTestId('loading-shell')).not.toBeInTheDocument();
		await expect(canvas.getByRole('status')).toHaveTextContent(/revealed/i);
	},
};
