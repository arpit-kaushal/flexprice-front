import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbSearchableSelect, type SbSelectOption } from './sb-searchable-select';

const OPTIONS: SbSelectOption[] = [
	{ value: 'alpha', label: 'Alpha Meter' },
	{ value: 'beta', label: 'Beta Feature' },
	{ value: 'gamma', label: 'Gamma SKU' },
	{ value: 'hidden', label: 'Hidden entitlement', disabled: true },
];

const meta: Meta<typeof SbSearchableSelect> = {
	title: 'Showcase/Atoms/SearchableSelect',
	component: SbSearchableSelect,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'padded' },
	args: {
		options: OPTIONS,
		label: 'Associated meter',
		placeholder: 'Choose…',
		searchPlaceholder: 'Filter…',
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof SbSearchableSelect>;

function Playground(props: ComponentProps<typeof SbSearchableSelect>) {
	const [v, setV] = useState<string>();
	return (
		<div className='w-[320px]'>
			<SbSearchableSelect {...props} value={v} onChange={setV} />
		</div>
	);
}

export const Default: Story = {
	render: (args) => <Playground {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex w-[360px] flex-col gap-6'>
			<SbSearchableSelect options={OPTIONS} label='Disabled' value='alpha' disabled placeholder='Unavailable' />
			<SbSearchableSelect options={OPTIONS} label='With error' value='' error='Pick a meter before saving.' placeholder='Required' />
		</div>
	),
};

function WithSearchFilteringDemo() {
	const [v, setV] = useState<string>();
	return (
		<div className='w-[320px]'>
			<SbSearchableSelect options={OPTIONS} value={v} onChange={setV} placeholder='Choose…' label='SKU' searchPlaceholder='Filter…' />
		</div>
	);
}

export const WithSearchFiltering: Story = {
	render: () => <WithSearchFilteringDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByText('Choose…'));
		const overlay = within(document.body);
		await userEvent.type(overlay.getByPlaceholderText('Filter…'), 'gamma');
		await expect(overlay.getByText('Gamma SKU')).toBeVisible();
	},
};
