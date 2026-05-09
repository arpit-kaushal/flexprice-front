import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { MemoryRouter } from 'react-router';
import { useMemo, useState } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbDataTable, type SbTableColumn } from './sb-data-table';
import { SbSkeleton } from './sb-skeleton';

interface Row {
	id: string;
	name: string;
	quantity: number;
}

const SAMPLE: Row[] = [
	{ id: '1', name: 'Northwind Robotics', quantity: 1200 },
	{ id: '2', name: 'Contoso SaaS', quantity: 98 },
	{ id: '3', name: 'Fabrikam Labs', quantity: 450 },
];

const columns: SbTableColumn<Row>[] = [
	{ id: 'tenant', header: 'Tenant', cell: (r) => <span>{r.name}</span> },
	{ id: 'qty', header: 'Events (period)', align: 'right', cell: (r) => <span className='tabular-nums'>{r.quantity}</span> },
];

const meta: Meta = {
	title: 'Showcase/Molecules/DataTable',
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => <SbDataTable columns={columns} data={SAMPLE} />,
};

const TableLoadingSkeleton = () => (
	<div className='space-y-2 rounded-md border border-border bg-card p-4'>
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className='flex gap-4'>
				<SbSkeleton className='h-4 flex-1' />
				<SbSkeleton className='h-4 w-24' />
			</div>
		))}
	</div>
);

export const Variants: Story = {
	render: () => (
		<div className='flex max-w-3xl flex-col gap-10'>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Loading skeleton</p>
				<TableLoadingSkeleton />
			</section>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Empty</p>
				<SbDataTable columns={columns} data={[]} emptyMessage='No usage rows' />
			</section>
			<section>
				<p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Populated</p>
				<SbDataTable columns={columns} data={SAMPLE} />
			</section>
		</div>
	),
};

function SortableDemo() {
	const [sortKey, setSortKey] = useState<'name' | 'qty'>('name');
	const [dir, setDir] = useState<'asc' | 'desc'>('asc');

	const toggle = (key: 'name' | 'qty') =>
		setSortKey((prev) => {
			if (prev === key) {
				setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
				return prev;
			}
			setDir('asc');
			return key;
		});

	const arrow = sortKey === 'name' ? (dir === 'asc' ? '↑' : '↓') : sortKey === 'qty' ? (dir === 'asc' ? '↑' : '↓') : '';

	const sorted = useMemo(() => {
		const next = [...SAMPLE];
		next.sort((a, b) => {
			const v = sortKey === 'name' ? a.name.localeCompare(b.name) : a.quantity - b.quantity;
			return dir === 'asc' ? v : -v;
		});
		return next;
	}, [dir, sortKey]);

	const sortColumns: SbTableColumn<Row>[] = [
		{
			id: 'tenant',
			header: (
				<button type='button' className={sortKey === 'name' ? 'font-semibold' : ''} onClick={() => toggle('name')}>
					Tenant {sortKey === 'name' ? arrow : ''}
				</button>
			),
			cell: (r) => <span>{r.name}</span>,
		},
		{
			id: 'qty',
			header: (
				<button type='button' className={sortKey === 'qty' ? 'font-semibold' : ''} onClick={() => toggle('qty')}>
					Metered units {sortKey === 'qty' ? arrow : ''}
				</button>
			),
			align: 'right',
			cell: (r) => <span className='tabular-nums'>{r.quantity}</span>,
		},
	];

	return (
		<div className='max-w-xl space-y-2'>
			<p className='text-sm text-muted-foreground'>Interact with headers to reorder.</p>
			<SbDataTable columns={sortColumns} data={sorted} />
		</div>
	);
}

export const SortableColumns: Story = {
	render: () => <SortableDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /Metered units/i }));
		await expect(canvas.getAllByRole('row')[1]).toHaveTextContent('Contoso SaaS');
	},
};

export const ScrollableManyRows: Story = {
	render: () => {
		const many: Row[] = Array.from({ length: 120 }, (_, i) => ({
			id: String(i),
			name: `Customer ${i + 1}`,
			quantity: (i % 50) + 1,
		}));
		const wide: SbTableColumn<Row>[] = [
			{ id: 't', header: 'Tenant', cell: (r) => <span>{r.name}</span> },
			{ id: 'u', header: 'Units', align: 'right', cell: (r) => <span className='tabular-nums'>{r.quantity}</span> },
		];
		return (
			<div className='max-w-xl space-y-2'>
				<p className='text-sm text-muted-foreground'>Many rows in a scroll container.</p>
				<div className='max-h-[260px] overflow-auto rounded-md border border-border'>
					<SbDataTable columns={wide} data={many} />
				</div>
			</div>
		);
	},
};

export const PaginationControls: Story = {
	decorators: [
		...storyChromeDecorators,
		(Story) => (
			<MemoryRouter initialEntries={['/story']}>
				<Story />
			</MemoryRouter>
		),
	],
	render: () => (
		<div className='max-w-3xl space-y-4'>
			<SbDataTable
				columns={[
					{ id: 'a', header: 'Tenant', cell: (r: Row) => r.name },
					{ id: 'b', header: 'Units', align: 'right', cell: (r: Row) => <span className='tabular-nums'>{r.quantity}</span> },
				]}
				data={SAMPLE}
			/>
			<p className='text-sm text-muted-foreground'>247 Customers · pagination is illustrative in the real app.</p>
		</div>
	),
};
