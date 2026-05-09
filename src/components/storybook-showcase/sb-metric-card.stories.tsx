import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
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
	parameters: { layout: 'padded' },
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
