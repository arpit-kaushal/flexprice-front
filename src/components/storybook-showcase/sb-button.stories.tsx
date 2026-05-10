import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { StoryFeedbackSlot } from './story-interaction-helpers';

const meta: Meta<typeof SbButton> = {
	title: 'Showcase/Atoms/Button',
	component: SbButton,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		variant: { control: 'select', options: ['default', 'secondary', 'ghost', 'destructive', 'outline'] },
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		children: { control: 'text' },
	},
	args: {
		children: 'Save changes',
		variant: 'default',
		size: 'md',
		isLoading: false,
		disabled: false,
	},
	parameters: {
		docs: {
			description: {
				component:
					'Token-backed button for Storybook demos. Use **Controls** to tweak hierarchy and density; **InteractShowsFeedback** demonstrates a realistic click acknowledgement in the DOM.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbButton>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-xl flex-col gap-4'>
			<div className='flex flex-wrap gap-2'>
				<SbButton variant='default'>Primary</SbButton>
				<SbButton variant='secondary'>Secondary</SbButton>
				<SbButton variant='ghost'>Ghost</SbButton>
				<SbButton variant='destructive'>Danger</SbButton>
				<SbButton variant='outline'>Outline</SbButton>
			</div>
			<div className='flex flex-wrap items-center gap-2 border-t pt-4'>
				<SbButton size='sm'>Small</SbButton>
				<SbButton size='md'>Medium</SbButton>
				<SbButton size='lg'>Large</SbButton>
			</div>
			<div className='flex flex-wrap gap-2 border-t pt-4'>
				<SbButton isLoading>Loading</SbButton>
				<SbButton disabled>Disabled</SbButton>
			</div>
		</div>
	),
};

export const InteractShowsFeedback: Story = {
	args: { children: 'Submit invoice', variant: 'default' },
	render: (args) => (
		<StoryFeedbackSlot
			confirmPrefix='Invoice queued'
			hintText='Click the button — a confirmation appears below.'
			trigger={<SbButton {...args} />}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /submit invoice/i }));
		await expect(await canvas.findByRole('status')).toHaveTextContent(/Invoice queued/);
	},
};
