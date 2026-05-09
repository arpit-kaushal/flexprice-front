import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from './lib/cn';
import { SbIconSearch } from './sb-icons';

export interface SbSearchBarProps {
	value?: string;
	debounceMs?: number;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	onChange?: (value: string) => void;
	onDebouncedChange?: (value: string) => void;
}

export function SbSearchBar({
	value,
	debounceMs = 300,
	placeholder = 'Search',
	disabled,
	className,
	onChange,
	onDebouncedChange,
}: SbSearchBarProps) {
	const [internal, setInternal] = useState(value ?? '');
	const controlled = value !== undefined;
	const displayed = controlled ? value : internal;

	const debounced = useDebouncedCallback((v: string) => onDebouncedChange?.(v), Math.max(debounceMs, 1));

	const setValue = (next: string) => {
		if (!controlled) setInternal(next);
		onChange?.(next);
		if (!onDebouncedChange) return;
		if (debounceMs <= 0) {
			onDebouncedChange(next);
		} else {
			debounced(next);
		}
	};

	return (
		<div className={cn('relative w-full max-w-md', className)}>
			<SbIconSearch className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
			<input
				type='search'
				autoComplete='off'
				placeholder={placeholder}
				disabled={disabled}
				value={displayed}
				onChange={(e) => setValue(e.target.value)}
				className='h-9 w-full rounded-md border border-input bg-background pl-9 pr-[4.25rem] text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
			/>
			<div className='pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1'>
				{displayed ? (
					<button
						type='button'
						className='pointer-events-auto rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
						onClick={() => setValue('')}>
						Clear
					</button>
				) : null}
			</div>
		</div>
	);
}
