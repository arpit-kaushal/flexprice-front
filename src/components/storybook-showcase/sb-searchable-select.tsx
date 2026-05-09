import * as React from 'react';
import { cn } from './lib/cn';

export interface SbSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SbSearchableSelectProps {
	options: SbSelectOption[];
	value?: string;
	onChange?: (value: string | undefined) => void;
	label?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
	error?: string;
	className?: string;
}

export function SbSearchableSelect({
	options,
	value,
	onChange,
	label,
	placeholder = 'Choose…',
	searchPlaceholder = 'Filter…',
	disabled,
	error,
	className,
}: SbSearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [q, setQ] = React.useState('');
	const rootRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, []);

	const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
	const selected = options.find((o) => o.value === value);

	return (
		<div ref={rootRef} className={cn('relative w-full max-w-sm space-y-1.5', className)}>
			{label ? <span className='text-sm font-medium text-foreground'>{label}</span> : null}
			<button
				type='button'
				disabled={disabled}
				onClick={() => !disabled && setOpen((o) => !o)}
				className={cn(
					'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm shadow-sm',
					error && 'border-destructive',
				)}>
				<span className={cn(!selected && 'text-muted-foreground')}>{selected?.label ?? placeholder}</span>
				<span className='text-muted-foreground'>▾</span>
			</button>
			{error ? <p className='text-sm text-destructive'>{error}</p> : null}
			{open ? (
				<div className='absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md'>
					<input
						autoFocus
						placeholder={searchPlaceholder}
						value={q}
						onChange={(e) => setQ(e.target.value)}
						className='mb-2 h-8 w-full rounded border border-input bg-background px-2 text-sm'
					/>
					<ul className='max-h-48 overflow-auto text-sm' role='listbox'>
						{filtered.map((o) => (
							<li key={o.value} role='option'>
								<button
									type='button'
									disabled={o.disabled}
									className={cn(
										'w-full rounded px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground',
										o.value === value && 'bg-accent/60',
										o.disabled && 'cursor-not-allowed opacity-50',
									)}
									onClick={() => {
										if (o.disabled) return;
										onChange?.(o.value);
										setOpen(false);
										setQ('');
									}}>
									{o.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}
