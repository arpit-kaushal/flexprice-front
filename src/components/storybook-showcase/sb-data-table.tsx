import * as React from 'react';
import { cn } from './lib/cn';

export type SbTableColumn<T> = {
	id: string;
	header: React.ReactNode;
	align?: 'left' | 'right' | 'center';
	className?: string;
	cell: (row: T) => React.ReactNode;
};

export interface SbDataTableProps<T> {
	columns: SbTableColumn<T>[];
	data: T[];
	className?: string;
	emptyMessage?: string;
}

export function SbDataTable<T>({ columns, data, className, emptyMessage = 'No rows' }: SbDataTableProps<T>) {
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
