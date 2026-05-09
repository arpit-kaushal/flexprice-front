import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbInput } from './sb-input';

const meta: Meta<typeof SbInput> = {
	title: 'Showcase/Atoms/Input',
	component: SbInput,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbInput>;

export const Default: Story = {
	args: { label: 'Display name', placeholder: 'Acme Corp' },
};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex w-full max-w-sm flex-col gap-6'>
			<SbInput label='Amount (number)' type='number' placeholder='0' />
			<SbInput label='With error' error='Must be greater than zero' defaultValue='0' />
			<SbInput label='Currency prefix' inputPrefix={<span className='text-muted-foreground'>$</span>} placeholder='0.00' />
			<SbInput label='Disabled' defaultValue='Locked' disabled />
		</div>
	),
};

export const TypeIntoField: Story = {
	args: { label: 'Memo', placeholder: 'Add context…' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText(/add context/i);
		await userEvent.type(input, 'hello');
		await expect(input).toHaveValue('hello');
	},
};
