import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router';
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
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Headless-friendly table primitive + optional TanStack virtualization. Review **Variants** / **Interact** entries for UX proofs.',
			},
		},
	},
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

const ROWS_10K: Row[] = Array.from({ length: 10_000 }, (_, i) => ({
	id: `row-${i}`,
	name: `Customer ${i + 1}`,
	quantity: (i % 50) + 1,
}));

type DynRow = Row & { subtitle?: string };
const ROWS_5K_DYN: DynRow[] = Array.from({ length: 5000 }, (_, i) => ({
	id: `dyn-${i}`,
	name: `Customer ${i + 1}`,
	quantity: (i % 50) + 1,
	subtitle: i % 10 === 0 ? `Extra context line for row ${i}\nSecond line of metadata` : undefined,
}));

function VirtualizedTenThousandDemo() {
	const cols: SbTableColumn<Row>[] = [
		{ id: 't', header: 'Tenant', gridTrack: '1.4fr', cell: (r) => <span>{r.name}</span> },
		{ id: 'u', header: 'Units', align: 'right', gridTrack: '100px', cell: (r) => <span className='tabular-nums'>{r.quantity}</span> },
	];
	return (
		<div className='max-w-xl space-y-2'>
			<p className='text-sm text-muted-foreground'>
				<code className='rounded bg-muted px-1'>10,000</code> rows with fixed{' '}
				<code className='rounded bg-muted px-1'>estimateRowHeight</code> — no DOM measurement (
				<code className='rounded bg-muted px-1'>measureDynamicRows: false</code>).
			</p>
			<SbDataTable
				columns={cols}
				data={ROWS_10K}
				getRowId={(r) => r.id}
				virtualize={{
					estimateRowHeight: 44,
					overscan: 12,
					scrollContainerHeight: 420,
					measureDynamicRows: false,
				}}
			/>
		</div>
	);
}

function VirtualizedDynamicHeightsDemo() {
	const cols: SbTableColumn<DynRow>[] = [
		{
			id: 't',
			header: 'Tenant',
			gridTrack: '1.6fr',
			cell: (r) =>
				r.subtitle ? (
					<span className='whitespace-pre-line text-left leading-snug'>
						{r.name}
						{'\n'}
						<span className='text-xs text-muted-foreground'>{r.subtitle}</span>
					</span>
				) : (
					<span>{r.name}</span>
				),
		},
		{ id: 'u', header: 'Units', align: 'right', gridTrack: '90px', cell: (r) => <span className='tabular-nums'>{r.quantity}</span> },
	];
	return (
		<div className='max-w-xl space-y-2'>
			<p className='text-sm text-muted-foreground'>
				Variable-height rows: <code className='rounded bg-muted px-1'>getRowHeight</code> guesses tall vs short rows;
				<code className='rounded bg-muted px-1'> measureDynamicRows</code> refines with DOM measurement.
			</p>
			<SbDataTable
				columns={cols}
				data={ROWS_5K_DYN}
				getRowId={(r) => r.id}
				virtualize={{
					estimateRowHeight: 40,
					getRowHeight: (i) => (ROWS_5K_DYN[i]?.subtitle ? 72 : 40),
					overscan: 8,
					scrollContainerHeight: 400,
					measureDynamicRows: true,
				}}
			/>
		</div>
	);
}

export const VirtualizedTenThousandRows: Story = {
	render: () => <VirtualizedTenThousandDemo />,
};

export const VirtualizedDynamicRowHeights: Story = {
	render: () => <VirtualizedDynamicHeightsDemo />,
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
