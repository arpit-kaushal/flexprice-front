import * as React from 'react';
import { cn } from './lib/cn';

export interface SbDateRangePickerProps {
	title?: string;
	startDate?: string;
	endDate?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	onChange?: (range: { startDate?: string; endDate?: string }) => void;
}

export function SbDateRangePicker({
	title = 'Date range',
	startDate,
	endDate,
	placeholder = 'Select range',
	disabled,
	className,
	onChange,
}: SbDateRangePickerProps) {
	const [start, setStart] = React.useState(startDate ?? '');
	const [end, setEnd] = React.useState(endDate ?? '');

	React.useEffect(() => {
		setStart(startDate ?? '');
		setEnd(endDate ?? '');
	}, [startDate, endDate]);

	const emit = (s: string, e: string) => {
		onChange?.({ startDate: s || undefined, endDate: e || undefined });
	};

	return (
		<fieldset disabled={disabled} className={cn('space-y-2 rounded-md border border-border bg-card p-3', className)}>
			<legend className='px-1 text-sm font-medium text-foreground'>{title}</legend>
			<p className='text-xs text-muted-foreground'>{placeholder}</p>
			<div className='flex flex-wrap items-center gap-2'>
				<label className='sr-only'>Start</label>
				<input
					type='date'
					aria-label={`${title} start`}
					value={start}
					onChange={(ev) => {
						const v = ev.target.value;
						setStart(v);
						emit(v, end);
					}}
					className='h-9 rounded-md border border-input bg-background px-2 text-sm'
				/>
				<span className='text-muted-foreground'>→</span>
				<label className='sr-only'>End</label>
				<input
					type='date'
					aria-label={`${title} end`}
					value={end}
					onChange={(ev) => {
						const v = ev.target.value;
						setEnd(v);
						emit(start, v);
					}}
					className='h-9 rounded-md border border-input bg-background px-2 text-sm'
				/>
			</div>
		</fieldset>
	);
}
