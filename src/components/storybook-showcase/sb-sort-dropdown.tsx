import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from './lib/cn';
import { SbButton } from './sb-button';

export type SbSortDirection = 'asc' | 'desc';

export interface SbSortOption {
	field: string;
	label: string;
	direction?: SbSortDirection;
}

export interface SbSortDropdownField {
	field: string;
	label: string;
}

export interface SbSortDropdownProps {
	options: SbSortDropdownField[];
	value: SbSortOption[];
	onChange: (next: SbSortOption[]) => void;
	disabled?: boolean;
	maxSorts?: number;
	className?: string;
}

export function SbSortDropdown({ options, value, onChange, disabled, maxSorts = 10, className }: SbSortDropdownProps) {
	const [open, setOpen] = React.useState(false);

	const addSort = (field: string) => {
		if (value.length >= maxSorts) return;
		const meta = options.find((o) => o.field === field);
		if (!meta) return;
		if (value.some((s) => s.field === field)) return;
		onChange([...value, { field, label: meta.label, direction: 'asc' }]);
	};

	const toggleDir = (field: string) => {
		onChange(value.map((s) => (s.field === field ? { ...s, direction: s.direction === 'asc' ? ('desc' as const) : ('asc' as const) } : s)));
	};

	const remove = (field: string) => {
		onChange(value.filter((s) => s.field !== field));
	};

	return (
		<div className={cn('inline-block', className)}>
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger asChild>
					<SbButton variant='outline' disabled={disabled} type='button'>
						Sort
					</SbButton>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						className='z-50 w-[min(100vw-2rem,22rem)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in'
						sideOffset={6}
						align='start'>
						{value.length === 0 ? (
							<div className='space-y-1 py-2'>
								<h4 className='text-base font-medium leading-none'>No sorting applied</h4>
								<p className='text-sm text-muted-foreground'>Add sorting to organize your data.</p>
							</div>
						) : (
							<ul className='space-y-2'>
								{value.map((s) => (
									<li key={s.field} className='flex items-center justify-between gap-2 rounded border border-border px-2 py-1.5 text-sm'>
										<span className='font-medium'>{s.label}</span>
										<div className='flex items-center gap-1'>
											<SbButton type='button' size='sm' variant='ghost' onClick={() => toggleDir(s.field)}>
												{s.direction === 'asc' ? 'Asc' : 'Desc'}
											</SbButton>
											<SbButton type='button' size='sm' variant='ghost' onClick={() => remove(s.field)}>
												×
											</SbButton>
										</div>
									</li>
								))}
							</ul>
						)}
						<div className='mt-3 border-t border-border pt-3'>
							<p className='mb-2 text-xs font-medium text-muted-foreground'>Add field</p>
							<div className='flex flex-wrap gap-1'>
								{options
									.filter((o) => !value.some((s) => s.field === o.field))
									.map((o) => (
										<SbButton key={o.field} type='button' size='sm' variant='secondary' onClick={() => addSort(o.field)}>
											{o.label}
										</SbButton>
									))}
							</div>
						</div>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
}
