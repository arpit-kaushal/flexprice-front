import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbTooltip, SbTooltipContent, SbTooltipTrigger } from './sb-tooltip';

interface Args {
	text: string;
	delayMs: number;
}

const meta: Meta<Args> = {
	title: 'Showcase/Atoms/Tooltip',
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		text: { control: 'text' },
		delayMs: { control: { type: 'range', min: 0, max: 1200, step: 50 } },
	},
	args: { text: 'This charge includes prorations from the upgrade path.', delayMs: 0 },
	parameters: {
		docs: {
			description: {
				component: 'Radix tooltip wired to showcase button. **InteractiveHover** asserts tooltip copy lands in the DOM (visible on hover).',
			},
		},
	},
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
	render: ({ text, delayMs }) => (
		<SbTooltip delayDuration={delayMs}>
			<SbTooltipTrigger asChild>
				<SbButton variant='outline'>Hover for context</SbButton>
			</SbTooltipTrigger>
			<SbTooltipContent side='top'>{text}</SbTooltipContent>
		</SbTooltip>
	),
};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-col gap-8'>
			<SbTooltip delayDuration={0}>
				<SbTooltipTrigger asChild>
					<SbButton variant='outline'>Instant (0ms)</SbButton>
				</SbTooltipTrigger>
				<SbTooltipContent>Appears immediately for dense UIs.</SbTooltipContent>
			</SbTooltip>
			<SbTooltip delayDuration={700}>
				<SbTooltipTrigger asChild>
					<SbButton variant='ghost'>Slow reveal (700ms)</SbButton>
				</SbTooltipTrigger>
				<SbTooltipContent>Delayed helper for cursor sweeps.</SbTooltipContent>
			</SbTooltip>
		</div>
	),
};

export const InteractiveHover: Story = {
	args: { text: 'Tooltip body from Controls.', delayMs: 0 },
	render: ({ text, delayMs }) => (
		<SbTooltip delayDuration={delayMs}>
			<SbTooltipTrigger asChild>
				<SbButton variant='outline'>Hover me</SbButton>
			</SbTooltipTrigger>
			<SbTooltipContent>{text}</SbTooltipContent>
		</SbTooltip>
	),
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.hover(canvas.getByRole('button', { name: /hover me/i }));
		await waitFor(() => expect(within(document.body).getByText(String(args.text))).toBeVisible());
	},
};
