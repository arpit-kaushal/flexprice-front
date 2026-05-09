import * as React from 'react';
import { cn } from './lib/cn';

export interface SbLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	label: string;
}

export function SbLabel({ label, className, children, ...props }: SbLabelProps) {
	const disabled = (props as { disabled?: boolean }).disabled;
	return (
		<label
			className={cn('text-sm font-medium leading-none text-foreground', disabled && 'cursor-not-allowed opacity-70', className)}
			{...props}>
			{label}
			{children}
		</label>
	);
}
