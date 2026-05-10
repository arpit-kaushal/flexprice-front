import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
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
		className: { control: 'text' },
	},
	args: {
		variant: 'default',
		className: 'max-w-md',
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Composable card shell for showcase docs. **InteractExport** proves the CTA affects visible status text.',
			},
		},
	},
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
			<SbCard variant='default'>
				<span className='text-sm'>Default</span>
			</SbCard>
			<SbCard variant='notched'>
				<span className='text-sm'>Notched + primary rail</span>
			</SbCard>
			<SbCard variant='bordered'>
				<span className='text-sm'>Bordered</span>
			</SbCard>
			<SbCard variant='elevated'>
				<span className='text-sm'>Elevated</span>
			</SbCard>
			<SbCard variant='warning' className='max-w-full md:col-span-2'>
				<span className='text-sm'>Brand warning tone</span>
			</SbCard>
		</div>
	),
};

function CardExportInteractive() {
	const [toast, setToast] = useState<string | null>(null);
	return (
		<SbCard className='max-w-lg'>
			<SbCardHeader
				title='Usage this period'
				subtitle='Synced from meters in near real time.'
				cta={
					<SbButton size='sm' type='button' onClick={() => setToast('CSV export queued — check downloads shortly.')}>
						Export
					</SbButton>
				}
			/>
			{toast ? (
				<p className='text-sm font-medium text-foreground' role='status' aria-live='polite'>
					{toast}
				</p>
			) : (
				<p className='text-sm text-muted-foreground'>Waiting for exporter…</p>
			)}
		</SbCard>
	);
}

export const InteractExport: Story = {
	render: () => <CardExportInteractive />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /export/i }));
		await expect(await canvas.findByRole('status')).toHaveTextContent(/queued/i);
	},
};
