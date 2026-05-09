import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
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
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbUsageMeterProgress>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className='mx-auto flex max-w-lg flex-col gap-6'>
			<SbUsageMeterProgress label='Healthy headroom' used={12_000} entitled={100_000} />
			<SbUsageMeterProgress label='Near capacity' used={95_900} entitled={100_000} />
			<SbUsageMeterProgress label='Explicit percent override' used={1} entitled={100} percent={72} />
		</div>
	),
};

export const LabelVisible: Story = {
	render: (args) => <SbUsageMeterProgress {...args} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(String(args.label))).toBeVisible();
	},
};
