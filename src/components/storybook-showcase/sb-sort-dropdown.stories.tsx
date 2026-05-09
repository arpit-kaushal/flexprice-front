import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbSortDropdown, type SbSortDropdownField, type SbSortOption } from './sb-sort-dropdown';

const options: SbSortDropdownField[] = [
	{ field: 'name', label: 'Name' },
	{ field: 'created_at', label: 'Created At' },
	{ field: 'updated_at', label: 'Updated At' },
	{ field: 'status', label: 'Status' },
	{ field: 'priority', label: 'Priority' },
];

const meta: Meta<typeof SbSortDropdown> = {
	title: 'Showcase/Molecules/SortDropdown',
	component: SbSortDropdown,
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'centered', backgrounds: { default: 'light' } },
	args: { disabled: false, maxSorts: 10, className: '' },
};

export default meta;
type Story = StoryObj<typeof SbSortDropdown>;

function Controlled(props: ComponentProps<typeof SbSortDropdown>) {
	const [sorts, setSorts] = useState<SbSortOption[]>([]);
	return (
		<div className='p-6'>
			<SbSortDropdown {...props} options={options} value={sorts} onChange={setSorts} />
		</div>
	);
}

export const Default: Story = {
	render: (args) => <Controlled {...args} />,
};

export const Variants: Story = {
	render: () => (
		<div className='flex flex-col gap-10 p-6'>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Idle (no sorts)</p>
				<Controlled />
			</section>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Disabled</p>
				<SbSortDropdown options={options} value={[]} onChange={() => {}} disabled />
			</section>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>With active sorts</p>
				<SbSortDropdown
					options={options}
					value={[
						{ field: 'created_at', label: 'Created At', direction: 'desc' },
						{ field: 'priority', label: 'Priority', direction: 'asc' },
					]}
					onChange={() => {}}
				/>
			</section>
		</div>
	),
};

export const InteractiveOpenPopover: Story = {
	render: (args) => <Controlled {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /sort/i }));
		const body = within(document.body);
		await expect(body.getByText(/no sorting applied/i)).toBeVisible();
	},
};
