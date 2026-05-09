import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';

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
	args: { children: 'Save changes' },
};

export default meta;
type Story = StoryObj<typeof SbButton>;

export const Default: Story = { args: { variant: 'default' } };

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

export const InteractiveSubmit: Story = {
	args: { children: 'Submit invoice', onClick: fn() },
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /submit invoice/i }));
		await expect(args.onClick).toHaveBeenCalled();
	},
};
