import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbMetricCard } from './sb-metric-card';

const meta: Meta<typeof SbMetricCard> = {
	title: 'Showcase/Molecules/MetricCard',
	component: SbMetricCard,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		title: { control: 'text' },
		value: { control: 'number' },
		currency: { control: 'text' },
		isPercent: { control: 'boolean' },
		showChangeIndicator: { control: 'boolean' },
		isNegative: { control: 'boolean' },
	},
	args: {
		title: 'Revenue (MTD)',
		value: 128_430.54,
		currency: 'USD',
		showChangeIndicator: true,
		isNegative: false,
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Static KPI tiles. **InteractTrend** demonstrates toggling polarity with visible narration.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbMetricCard>;

export const Default: Story = {
	render: (args) => <SbMetricCard {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2'>
			<SbMetricCard title='Revenue (MTD)' value={128430.54} currency='USD' showChangeIndicator isNegative={false} />
			<SbMetricCard title='Gross margin' value={61.42} isPercent showChangeIndicator isNegative={false} />
			<SbMetricCard title='Active subscriptions' value={1842} showChangeIndicator={false} />
			<SbMetricCard title='Churned ARR' value={12400} currency='USD' showChangeIndicator isNegative />
		</div>
	),
};

function TrendToggleDemo() {
	const [negative, setNegative] = useState(false);
	return (
		<div className='max-w-md space-y-3'>
			<SbButton type='button' variant='outline' size='sm' onClick={() => setNegative((v) => !v)}>
				Toggle sentiment
			</SbButton>
			<SbMetricCard title='Growth delta' value={4.12} isPercent showChangeIndicator isNegative={negative} />
			<p className='text-sm text-muted-foreground' aria-live='polite' role='status' data-testid='sentiment-flag'>
				Showing {negative ? 'negative churn (red caret)' : 'positive expansion (chart tone)'}.
			</p>
		</div>
	);
}

export const InteractTrend: Story = {
	render: () => <TrendToggleDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('sentiment-flag')).toHaveTextContent(/positive expansion/i);
		await userEvent.click(canvas.getByRole('button', { name: /toggle sentiment/i }));
		await expect(canvas.getByTestId('sentiment-flag')).toHaveTextContent(/negative churn/i);
	},
};
