import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbInput, type SbInputProps } from './sb-input';

const meta: Meta<typeof SbInput> = {
	title: 'Showcase/Atoms/Input',
	component: SbInput,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'padded' },
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search'] },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		fullWidth: { control: 'boolean' },
	},
	args: {
		label: 'Display name',
		placeholder: 'Acme Corp',
		disabled: false,
		error: '',
		fullWidth: true,
	},
};

export default meta;
type Story = StoryObj<typeof SbInput>;

function ControlledInputPlayground(props: SbInputProps) {
	const { error, ...rest } = props;
	const [value, setValue] = useState('');
	const err = typeof error === 'string' && error.length > 0 ? error : undefined;
	return <SbInput {...rest} error={err} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export const Default: Story = {
	render: (args) => <ControlledInputPlayground {...(args as SbInputProps)} />,
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

function InputEchoPreview(props: Omit<SbInputProps, 'value' | 'onChange' | 'defaultValue'>) {
	const [value, setValue] = useState('');
	return (
		<div className='mx-auto w-full max-w-sm space-y-3'>
			<SbInput {...props} value={value} onChange={(e) => setValue(e.target.value)} placeholder={props.placeholder ?? 'Type here…'} />
			<p className='text-sm text-muted-foreground' aria-live='polite' role='region' aria-label='Live preview'>
				<span className='font-medium text-foreground'>Preview:</span>{' '}
				<span data-story-echo>{value.length ? value : '… awaiting input …'}</span>
			</p>
		</div>
	);
}

export const InteractTypingEcho: Story = {
	args: {
		label: 'Invoice memo',
		placeholder: 'Add context…',
	},
	render: (args) => <InputEchoPreview {...(args as SbInputProps)} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const box = canvas.getByRole('textbox');
		await userEvent.type(box, 'Usage spike');
		const preview = canvas.getByRole('region', { name: /live preview/i });
		await expect(preview.querySelector('[data-story-echo]')).toHaveTextContent('Usage spike');
	},
};
