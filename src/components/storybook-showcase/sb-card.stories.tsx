import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbCard, SbCardHeader } from './sb-card';

const meta: Meta<typeof SbCard> = {
	title: 'Showcase/Atoms/Card',
	component: SbCard,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	argTypes: {
		variant: { control: 'select', options: ['default', 'notched', 'bordered', 'elevated', 'warning'] },
	},
	args: { variant: 'default', className: 'max-w-md border-border bg-card text-card-foreground' },
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SbCard>;

export const Default: Story = {
	render: (args) => (
		<SbCard {...args}>
			<p className='text-sm text-muted-foreground'>Card body using semantic text and muted helper copy.</p>
		</SbCard>
	),
};

export const Variants: Story = {
	render: () => (
		<div className='grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2'>
			<SbCard variant='default' className='border-border bg-card'>
				<span className='text-sm'>Default</span>
			</SbCard>
			<SbCard variant='notched' className='border-border bg-card'>
				<span className='text-sm'>Notched + primary rail</span>
			</SbCard>
			<SbCard variant='bordered' className='border-border bg-card'>
				<span className='text-sm'>Bordered</span>
			</SbCard>
			<SbCard variant='elevated' className='border-border bg-card'>
				<span className='text-sm'>Elevated</span>
			</SbCard>
			<SbCard variant='warning' className='max-w-full'>
				<span className='text-sm'>Warning tone</span>
			</SbCard>
		</div>
	),
};

export const WithHeaderAndButton: Story = {
	render: () => (
		<SbCard className='max-w-lg border-border bg-card'>
			<SbCardHeader
				title='Usage this period'
				subtitle='Synced from meters in near real time.'
				cta={<SbButton size='sm'>Export</SbButton>}
			/>
		</SbCard>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /export/i }));
		await expect(canvas.getByRole('button', { name: /export/i })).toBeVisible();
	},
};
