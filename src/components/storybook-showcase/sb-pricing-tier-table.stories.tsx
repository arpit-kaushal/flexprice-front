import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbPricingTierTable, type SbPricingTierRow } from './sb-pricing-tier-table';

const tiers: SbPricingTierRow[] = [
	{ from: 0, upTo: 1_000_000, unitPrice: '0.002', flatFee: '0' },
	{ from: 1_000_001, upTo: 10_000_000, unitPrice: '0.0015', flatFee: '50' },
	{ from: 10_000_001, upTo: null, unitPrice: '0.001', flatFee: '200' },
];

const meta: Meta<typeof SbPricingTierTable> = {
	title: 'Showcase/Organisms/PricingTierTable',
	component: SbPricingTierTable,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: { currencyLabel: { control: 'text' } },
	args: { tiers, currencyLabel: 'USD' },
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Static graduated grid. **InteractHeader** asserts the currency label propagates to column headers.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbPricingTierTable>;

export const Default: Story = {
	render: (args) => <SbPricingTierTable {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(new RegExp(`Per unit \\(${args.currencyLabel}\\)`, 'i'))).toBeVisible();
	},
};

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-4xl flex-col gap-8'>
			<SbPricingTierTable tiers={tiers} currencyLabel='USD' />
			<SbPricingTierTable tiers={[{ from: 0, upTo: null, unitPrice: '0.02', flatFee: '0' }]} currencyLabel='EUR' />
		</div>
	),
};
