import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbSpinner } from './sb-spinner';

const meta: Meta<typeof SbSpinner> = {
	title: 'Showcase/Atoms/Spinner',
	component: SbSpinner,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { size: { control: { type: 'range', min: 12, max: 56, step: 2 } }, className: { control: 'text' } },
	args: { size: 24, className: 'text-primary' },
	parameters: {
		docs: {
			description: {
				component: 'Inline SVG spinner. **InteractReveal** mounts/unmounts it with visible helper text for reviewers.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbSpinner>;

export const Default: Story = {
	render: (args) => (
		<div className='p-6'>
			<SbSpinner {...args} />
		</div>
	),
};

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

function SpinnerRevealDemo() {
	const [on, setOn] = useState(true);
	return (
		<div className='space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setOn((v) => !v)}>
				{on ? 'Hide spinner' : 'Show spinner'}
			</SbButton>
			<div className='flex min-h-[48px] items-center gap-3 rounded-md border border-dashed border-border p-4'>
				{on ? (
					<span data-testid='live-spinner' className='inline-flex'>
						<SbSpinner size={32} />
					</span>
				) : null}
				<p className='text-sm text-muted-foreground' role='status' aria-live='polite'>
					{on ? 'Spinner visible in this panel.' : 'Spinner hidden — panel idle.'}
				</p>
			</div>
		</div>
	);
}

export const InteractReveal: Story = {
	render: () => <SpinnerRevealDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('live-spinner')).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: /hide spinner/i }));
		await expect(canvas.queryByTestId('live-spinner')).not.toBeInTheDocument();
		await expect(canvas.getByRole('status')).toHaveTextContent(/hidden/i);
	},
};
