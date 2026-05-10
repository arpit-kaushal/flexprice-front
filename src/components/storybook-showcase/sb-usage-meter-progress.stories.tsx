import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbUsageMeterProgress } from './sb-usage-meter-progress';

const meta: Meta<typeof SbUsageMeterProgress> = {
	title: 'Showcase/Molecules/UsageMeterProgress',
	component: SbUsageMeterProgress,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		label: { control: 'text' },
		used: { control: 'number' },
		entitled: { control: 'number' },
		percent: { control: 'number' },
	},
	args: { label: 'LLM completions this cycle', used: 42_050, entitled: 100_000 },
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Bridges metering numbers to progress UI. **InteractBurst** simulates traffic spikes with readable fill updates.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof SbUsageMeterProgress>;

export const Default: Story = {
	render: (args) => <SbUsageMeterProgress {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex max-w-lg flex-col gap-6'>
			<SbUsageMeterProgress label='Healthy headroom' used={12_000} entitled={100_000} />
			<SbUsageMeterProgress label='Near capacity' used={95_900} entitled={100_000} />
			<SbUsageMeterProgress label='Explicit percent override' used={1} entitled={100} percent={72} />
		</div>
	),
};

type MeterProps = ComponentProps<typeof SbUsageMeterProgress>;

function BurstDemo({
	baselineUsed,
	label,
	entitled,
	percent,
	className,
}: Pick<MeterProps, 'label' | 'entitled' | 'percent' | 'className'> & { baselineUsed: number }) {
	const [used, setUsed] = useState(baselineUsed);
	const safeEntitled = entitled ?? 100_000;
	const pct = useMemo(() => Math.min(100, Math.round((used / safeEntitled) * 100)), [used, safeEntitled]);
	return (
		<div className='mx-auto max-w-lg space-y-3'>
			<SbButton type='button' size='sm' variant='outline' onClick={() => setUsed((u) => u + 22_500)}>
				Simulate burst (+22.5k units)
			</SbButton>
			<SbUsageMeterProgress label={label} used={used} entitled={safeEntitled} percent={percent} className={className} />
			<p className='text-sm text-muted-foreground' role='status' aria-live='polite' data-testid='fill-readout'>
				Rendered fill ≈ <strong>{pct}%</strong> of entitled volume.
			</p>
		</div>
	);
}

export const InteractBurst: Story = {
	render: () => <BurstDemo label='Burst traffic sandbox' entitled={100_000} baselineUsed={20_000} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('fill-readout')).toHaveTextContent(/20%/);
		await userEvent.click(canvas.getByRole('button', { name: /simulate burst/i }));
		await expect(canvas.getByTestId('fill-readout')).toHaveTextContent(/43%/);
	},
};

export const LabelVisible: Story = {
	render: (args) => <SbUsageMeterProgress {...args} />,
	play: async ({ args: a, canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(String(a.label))).toBeVisible();
	},
};
