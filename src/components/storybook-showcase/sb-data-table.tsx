import { useVirtualizer } from '@tanstack/react-virtual';
import * as React from 'react';
import { cn } from './lib/cn';

type RowKey = string | number | bigint;

export type SbTableColumn<T> = {
	id: string;
	header: React.ReactNode;
	align?: 'left' | 'right' | 'center';
	className?: string;
	gridTrack?: string;
	cell: (row: T) => React.ReactNode;
};

export type SbDataTableVirtualizeOptions = {
	estimateRowHeight: number;
	overscan?: number;
	scrollContainerHeight?: number;
	getRowHeight?: (index: number) => number;
	measureDynamicRows?: boolean;
};

export interface SbDataTableProps<T> {
	columns: SbTableColumn<T>[];
	data: T[];
	className?: string;
	emptyMessage?: string;
	virtualize?: SbDataTableVirtualizeOptions | false;
	getRowId?: (row: T, index: number) => RowKey;
}

function gridTemplate(columns: SbTableColumn<unknown>[]): string {
	return columns.map((c) => c.gridTrack ?? 'minmax(0,1fr)').join(' ');
}

function SbDataTableVirtualBody<T>({
	columns,
	data,
	grid,
	virtualize,
	getRowId,
}: {
	columns: SbTableColumn<T>[];
	data: T[];
	grid: string;
	virtualize: SbDataTableVirtualizeOptions;
	getRowId?: (row: T, index: number) => RowKey;
}) {
	const scrollRef = React.useRef<HTMLDivElement>(null);
	const estimate = virtualize.estimateRowHeight;
	const measureDynamic = virtualize.measureDynamicRows ?? Boolean(virtualize.getRowHeight);

	const virtualizer = useVirtualizer({
		count: data.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: (i) => virtualize.getRowHeight?.(i) ?? estimate,
		overscan: virtualize.overscan ?? 8,
		getItemKey: getRowId ? (index) => getRowId(data[index], index) : undefined,
	});

	const height = virtualize.scrollContainerHeight ?? 400;

	return (
		<div ref={scrollRef} className='relative w-full overflow-auto' style={{ height, maxHeight: height }} role='rowgroup'>
			<div className='sticky top-0 z-10 grid min-w-full border-b border-border bg-muted/50' style={{ gridTemplateColumns: grid }}>
				{columns.map((col) => (
					<div
						key={col.id}
						className={cn(
							'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground',
							col.align === 'right' && 'text-right',
							col.align === 'center' && 'text-center',
							col.className,
						)}>
						{col.header}
					</div>
				))}
			</div>
			<div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
				{virtualizer.getVirtualItems().map((vi) => {
					const row = data[vi.index];
					return (
						<div
							key={vi.key}
							data-index={vi.index}
							ref={measureDynamic ? virtualizer.measureElement : undefined}
							role='row'
							className='absolute left-0 right-0 grid border-b border-border hover:bg-muted/40'
							style={{
								transform: `translateY(${vi.start}px)`,
								gridTemplateColumns: grid,
							}}>
							{columns.map((col) => (
								<div
									key={col.id}
									role='cell'
									className={cn(
										'flex items-center px-3 py-2 text-sm align-middle',
										col.align === 'right' && 'justify-end text-right tabular-nums',
										col.align === 'center' && 'justify-center text-center',
									)}>
									{col.cell(row)}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function SbDataTable<T>({ columns, data, className, emptyMessage = 'No rows', virtualize, getRowId }: SbDataTableProps<T>) {
	const grid = React.useMemo(() => gridTemplate(columns as SbTableColumn<unknown>[]), [columns]);

	if (virtualize && data.length === 0) {
		return (
			<div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
				<div className='px-3 py-8 text-center text-sm text-muted-foreground'>{emptyMessage}</div>
			</div>
		);
	}

	if (virtualize) {
		return (
			<div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
				<SbDataTableVirtualBody columns={columns} data={data} grid={grid} virtualize={virtualize} getRowId={getRowId} />
			</div>
		);
	}

	return (
		<div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
			<table className='w-full caption-bottom text-sm'>
				<thead className='border-b border-border bg-muted/50'>
					<tr>
						{columns.map((col) => (
							<th
								key={col.id}
								className={cn(
									'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground',
									col.align === 'right' && 'text-right',
									col.align === 'center' && 'text-center',
									col.className,
								)}>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} className='px-3 py-8 text-center text-muted-foreground'>
								{emptyMessage}
							</td>
						</tr>
					) : (
						data.map((row, i) => (
							<tr key={i} className='border-b border-border last:border-0 hover:bg-muted/40'>
								{columns.map((col) => (
									<td
										key={col.id}
										className={cn(
											'px-3 py-2 align-middle',
											col.align === 'right' && 'text-right tabular-nums',
											col.align === 'center' && 'text-center',
										)}>
										{col.cell(row)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
