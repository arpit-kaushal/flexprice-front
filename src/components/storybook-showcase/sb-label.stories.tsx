import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbInput } from './sb-input';
import { SbLabel } from './sb-label';

const meta: Meta<typeof SbLabel> = {
	title: 'Showcase/Atoms/Label',
	component: SbLabel,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	args: { label: 'Invoice memo', htmlFor: 'memo-field' },
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbLabel>;

export const Default: Story = {
	render: (args) => (
		<div className='mx-auto w-full max-w-sm space-y-2'>
			<SbLabel {...args} />
			<SbInput id='memo-field' placeholder='Optional note on this invoice' onChange={() => {}} />
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex w-full max-w-sm flex-col gap-6'>
			<div className='space-y-1'>
				<SbLabel htmlFor='a' label='Enabled label' />
				<SbInput id='a' placeholder='Type here' onChange={() => {}} />
			</div>
			<div className='space-y-1'>
				<SbLabel htmlFor='b' label='Disabled label' disabled />
				<SbInput id='b' value='Read only' disabled onChange={() => {}} />
			</div>
		</div>
	),
};

function FocusInputFromLabelDemo() {
	const [v, setV] = useState('');
	return (
		<div className='mx-auto w-full max-w-sm space-y-2'>
			<SbLabel htmlFor='focus-target' label='Click label to focus input' />
			<SbInput
				id='focus-target'
				value={v}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setV(e.target.value)}
				placeholder='Focused via label htmlFor'
			/>
		</div>
	);
}

export const FocusInputFromLabel: Story = {
	render: () => <FocusInputFromLabelDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByText(/click label to focus input/i));
		const input = canvas.getByRole('textbox');
		await expect(input).toHaveFocus();
	},
};
