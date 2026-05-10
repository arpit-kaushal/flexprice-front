import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbBadge, type SbBadgeProps } from './sb-badge';
import { SbButton } from './sb-button';

const meta: Meta<typeof SbBadge> = {
	title: 'Showcase/Atoms/Badge',
	component: SbBadge,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
		children: { control: 'text' },
	},
	args: {
		children: 'Beta',
		variant: 'default',
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Static pill for environment / phase labels. **InteractToggleBadge** wraps it with UI state so reviewers see a deliberate hide/show outcome.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbBadge>;

export const Default: Story = {
	render: (args) => (
		<div className='inline-flex'>
			<SbBadge {...args} />
		</div>
	),
};

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

function ToggleBadgePanel(props: SbBadgeProps) {
	const [visible, setVisible] = useState(true);
	return (
		<div className='max-w-sm space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setVisible((v) => !v)}>
				{visible ? 'Hide badge' : 'Show badge'}
			</SbButton>
			{visible ? (
				<SbBadge {...props} variant={props.variant} data-testid='live-badge'>
					{props.children}
				</SbBadge>
			) : (
				<p className='text-sm text-muted-foreground' role='status' aria-live='polite'>
					Badge is hidden — click “Show badge” to reveal it again.
				</p>
			)}
		</div>
	);
}

export const InteractToggleBadge: Story = {
	args: { children: 'Environment: production', variant: 'destructive' },
	render: (args) => <ToggleBadgePanel {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('live-badge')).toBeVisible();
		await userEvent.click(canvas.getByRole('button', { name: /hide badge/i }));
		await expect(canvas.getByRole('status')).toHaveTextContent(/hidden/i);
		await userEvent.click(canvas.getByRole('button', { name: /show badge/i }));
		await expect(canvas.getByTestId('live-badge')).toHaveTextContent(/production/i);
	},
};
