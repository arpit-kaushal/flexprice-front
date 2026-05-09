import * as React from 'react';
import { cn } from './lib/cn';

export interface SbInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
	label?: string;
	error?: string;
	inputPrefix?: React.ReactNode;
	fullWidth?: boolean;
}

export const SbInput = React.forwardRef<HTMLInputElement, SbInputProps>(
	({ className, label, error, inputPrefix, id, fullWidth, ...props }, ref) => {
		const autoId = React.useId();
		const inputId = id ?? autoId;
		return (
			<div className={cn('space-y-1.5', fullWidth && 'w-full')}>
				{label ? (
					<label
						htmlFor={inputId}
						className='text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
						{label}
					</label>
				) : null}
				<div className='relative flex items-stretch'>
					{inputPrefix ? (
						<span className='flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground'>
							{inputPrefix}
						</span>
					) : null}
					<input
						ref={ref}
						id={inputId}
						className={cn(
							'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm',
							inputPrefix && 'rounded-l-none',
							error && 'border-destructive focus-visible:ring-destructive',
							className,
						)}
						aria-invalid={error ? true : undefined}
						{...props}
					/>
				</div>
				{error ? <p className='text-sm text-destructive'>{error}</p> : null}
			</div>
		);
	},
);
SbInput.displayName = 'SbInput';
