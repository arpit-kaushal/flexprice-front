import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useMemo, useState, useEffect } from 'react';
import { storyChromeDecorators } from './preview-decorator';
import { SbButton } from './sb-button';
import { SbDataTable, type SbTableColumn } from './sb-data-table';
import { SbInput } from './sb-input';
import { SbLabel } from './sb-label';
import { useFilterStore } from '@/hooks/useFilterStore';

type Status = 'all' | 'draft' | 'finalized' | 'voided';

interface InvoiceRow {
	id: string;
	customer: string;
	plan: string;
	status: Status;
	amount: string;
}

const MOCK: InvoiceRow[] = [
	{ id: 'inv_001', customer: 'Northwind', plan: 'Pro', status: 'finalized', amount: '$120.00' },
	{ id: 'inv_002', customer: 'Contoso', plan: 'Starter', status: 'draft', amount: '$40.00' },
	{ id: 'inv_003', customer: 'Fabrikam', plan: 'Pro', status: 'voided', amount: '$80.00' },
	{ id: 'inv_004', customer: 'Adventure', plan: 'Enterprise', status: 'finalized', amount: '$2,400.00' },
	{ id: 'inv_005', customer: 'Wide World', plan: 'Starter', status: 'finalized', amount: '$12.00' },
];

const columns: SbTableColumn<InvoiceRow>[] = [
	{ id: 'id', header: 'Invoice', gridTrack: 'minmax(100px,1.2fr)', cell: (r) => <span className='font-mono text-xs'>{r.id}</span> },
	{ id: 'customer', header: 'Customer', gridTrack: '1.2fr', cell: (r) => r.customer },
	{ id: 'plan', header: 'Plan', gridTrack: '0.8fr', cell: (r) => r.plan },
	{ id: 'status', header: 'Status', gridTrack: '0.8fr', cell: (r) => <span className='capitalize'>{r.status}</span> },
	{ id: 'amount', header: 'Amount', align: 'right', gridTrack: '90px', cell: (r) => r.amount },
];

function InvoicesFiltersTableDemo({ routeKey = 'invoices-story' }: { routeKey?: string }) {
	const { filters, setFilter, resetFilters, getFilters, fingerprint, urlParam } = useFilterStore(routeKey);
	const [urlSearch, setUrlSearch] = useState(() => (typeof window !== 'undefined' ? window.location.search : ''));

	useEffect(() => {
		setUrlSearch(typeof window !== 'undefined' ? window.location.search : '');
	}, [fingerprint]);

	const status = (filters.status as Status | undefined) ?? 'all';
	const plan = (filters.plan as string) ?? '';
	const customerQuery = String(filters.customerQuery ?? '');
	const sortColumn = (filters.sortColumn as string) ?? 'customer';
	const sortDir = (filters.sortDirection as 'asc' | 'desc') ?? 'asc';
	const dateFrom = String(filters.dateFrom ?? '');
	const dateTo = String(filters.dateTo ?? '');

	const filtered = useMemo(() => {
		let rows = [...MOCK];
		if (status !== 'all') rows = rows.filter((r) => r.status === status);
		if (plan.trim()) rows = rows.filter((r) => r.plan.toLowerCase().includes(plan.toLowerCase()));
		if (customerQuery.trim()) {
			const q = customerQuery.toLowerCase();
			rows = rows.filter((r) => r.customer.toLowerCase().includes(q));
		}
		if (dateFrom || dateTo) {
			rows = rows.filter(() => true);
		}
		rows.sort((a, b) => {
			const av = sortColumn === 'amount' ? parseFloat(a.amount.replace(/[^0-9.-]/g, '') || '0') : (a as never)[sortColumn];
			const bv = sortColumn === 'amount' ? parseFloat(b.amount.replace(/[^0-9.-]/g, '') || '0') : (b as never)[sortColumn];
			if (typeof av === 'string' && typeof bv === 'string') {
				const c = av.localeCompare(bv);
				return sortDir === 'asc' ? c : -c;
			}
			const n = (av as number) - (bv as number);
			return sortDir === 'asc' ? n : -n;
		});
		return rows;
	}, [customerQuery, plan, sortColumn, sortDir, status, dateFrom, dateTo]);

	const storagePreview =
		typeof window !== 'undefined' ? (window.sessionStorage.getItem(`filters:${routeKey}`)?.slice(0, 120) ?? '(empty)') : 'n/a';

	return (
		<div className='flex max-w-5xl flex-col gap-4'>
			<p className='text-sm text-muted-foreground'>
				Multi-dimensional filters live in sessionStorage under <code className='rounded bg-muted px-1'>filters:&lt;routeKey&gt;</code>. Only
				a compact fingerprint is written to the URL (<code className='rounded bg-muted px-1'>?{urlParam}=…</code>).
			</p>
			<div className='grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-3'>
				<div className='space-y-1'>
					<SbLabel htmlFor='df' label='Date from' />
					<SbInput id='df' type='date' value={dateFrom} onChange={(e) => setFilter('dateFrom', e.target.value)} />
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='dt' label='Date to' />
					<SbInput id='dt' type='date' value={dateTo} onChange={(e) => setFilter('dateTo', e.target.value)} />
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='st' label='Status' />
					<select
						id='st'
						className='flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm'
						value={status}
						onChange={(e) => setFilter('status', e.target.value as Status)}>
						<option value='all'>All</option>
						<option value='draft'>Draft</option>
						<option value='finalized'>Finalized</option>
						<option value='voided'>Voided</option>
					</select>
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='pl' label='Plan contains' />
					<SbInput id='pl' placeholder='Pro, Starter…' value={plan} onChange={(e) => setFilter('plan', e.target.value)} />
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='cu' label='Customer search' />
					<SbInput id='cu' placeholder='Name…' value={customerQuery} onChange={(e) => setFilter('customerQuery', e.target.value)} />
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='sc' label='Sort column' />
					<select
						id='sc'
						className='flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm'
						value={sortColumn}
						onChange={(e) => setFilter('sortColumn', e.target.value)}>
						<option value='customer'>Customer</option>
						<option value='plan'>Plan</option>
						<option value='status'>Status</option>
						<option value='amount'>Amount</option>
					</select>
				</div>
				<div className='space-y-1'>
					<SbLabel htmlFor='sd' label='Sort direction' />
					<select
						id='sd'
						className='flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm'
						value={sortDir}
						onChange={(e) => setFilter('sortDirection', e.target.value as 'asc' | 'desc')}>
						<option value='asc'>Ascending</option>
						<option value='desc'>Descending</option>
					</select>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-2'>
				<SbButton type='button' variant='outline' size='sm' onClick={() => resetFilters()}>
					Reset filters
				</SbButton>
				<SbButton type='button' variant='ghost' size='sm' onClick={() => alert(JSON.stringify(getFilters(), null, 2))}>
					getFilters() (alert)
				</SbButton>
			</div>
			<div className='grid gap-2 text-xs text-muted-foreground md:grid-cols-2'>
				<p>
					<strong className='text-foreground'>Fingerprint:</strong> {fingerprint}
				</p>
				<p className='break-all'>
					<strong className='text-foreground'>URL:</strong> {urlSearch || '(no query)'}
				</p>
				<p className='md:col-span-2 break-all'>
					<strong className='text-foreground'>sessionStorage preview:</strong> {storagePreview}…
				</p>
			</div>
			<p className='text-sm text-muted-foreground' data-testid='row-count-summary'>
				Rendering <strong className='text-foreground'>{filtered.length}</strong> row{filtered.length === 1 ? '' : 's'} for current filters.
			</p>
			<SbDataTable columns={columns} data={filtered} />
		</div>
	);
}

const meta: Meta = {
	title: 'Showcase/Molecules/DataTableWithFilters',
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates `useFilterStore` (Zustand + sessionStorage per route key) with URL fingerprint sync and the showcase DataTable.',
			},
		},
	},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => <InvoicesFiltersTableDemo routeKey='invoices-default' />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId('row-count-summary')).toHaveTextContent(/5 row/);
		const status = canvas.getByLabelText(/^status$/i);
		await userEvent.selectOptions(status, 'voided');
		await expect(canvas.getByTestId('row-count-summary')).toHaveTextContent(/1 row/);
		await expect(canvas.getByText(/fabrikam/i)).toBeVisible();
	},
};

export const Variants: Story = {
	render: () => (
		<div className='grid max-w-6xl gap-10 lg:grid-cols-2'>
			<div>
				<p className='mb-2 text-xs font-medium uppercase text-muted-foreground'>Interactive (store + URL)</p>
				<InvoicesFiltersTableDemo routeKey='invoices-variant-live' />
			</div>
			<div>
				<p className='mb-2 text-xs font-medium uppercase text-muted-foreground'>Static void-only slice</p>
				<p className='mb-3 text-sm text-muted-foreground'>Illustrates the same columns when status = voided without Zustand overhead.</p>
				<SbDataTable columns={columns} data={MOCK.filter((r) => r.status === 'voided')} />
			</div>
		</div>
	),
};
