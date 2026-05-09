import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbSearchBar } from './sb-search-bar';

const meta: Meta<typeof SbSearchBar> = {
	title: 'Showcase/Molecules/SearchBar',
	component: SbSearchBar,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { debounceMs: { control: 'number' }, placeholder: { control: 'text' }, disabled: { control: 'boolean' } },
	args: { placeholder: 'Search plans, SKU, entitlement…', debounceMs: 400 },
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbSearchBar>;

function SearchBarPlayground(props: ComponentProps<typeof SbSearchBar>) {
	const [v, setV] = useState('');
	const debounced = fn();
	return (
		<div className='w-[360px] space-y-2'>
			<SbSearchBar
				{...props}
				value={v}
				onChange={setV}
				onDebouncedChange={(next) => {
					debounced(next);
				}}
			/>
			<p className='text-xs text-muted-foreground'>Debounced payloads appear in the Actions panel.</p>
		</div>
	);
}

export const Default: Story = {
	render: (args) => <SearchBarPlayground {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'api');
		await expect(input).toHaveValue('api');
	},
};

export const Variants: Story = {
	render: () => (
		<div className='flex w-[360px] flex-col gap-6'>
			<div>
				<p className='mb-1 text-xs text-muted-foreground'>Active</p>
				<SbSearchBar placeholder='Filter…' value='' onChange={() => {}} debounceMs={0} onDebouncedChange={() => {}} />
			</div>
			<div>
				<p className='mb-1 text-xs text-muted-foreground'>Disabled</p>
				<SbSearchBar placeholder='Unavailable' value='locked' onChange={() => {}} debounceMs={0} disabled />
			</div>
		</div>
	),
};

function ControlledClearDemo() {
	const [v, setV] = useState('sandbox');
	return (
		<div className='w-[320px]'>
			<SbSearchBar value={v} onChange={setV} debounceMs={0} onDebouncedChange={() => {}} placeholder='Filter customers…' />
		</div>
	);
}

export const ControlledClear: Story = {
	render: () => <ControlledClearDemo />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const input = c.getByPlaceholderText(/customers/i);
		await expect(input).toHaveValue('sandbox');
		await userEvent.click(c.getByRole('button', { name: /clear/i }));
		await expect(input).toHaveValue('');
	},
};
