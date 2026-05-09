import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from './lib/cn';

const chipVariants = cva(
	'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'border-border bg-muted/60 text-foreground',
				success: 'border-chart-2/30 bg-chart-2/10 text-chart-2',
				warning: 'border-blue/35 bg-blue-light text-blue dark:border-blue/40 dark:bg-blue/10 dark:text-blue',
				failed: 'border-destructive/40 bg-destructive/10 text-destructive',
				info: 'border-primary/30 bg-primary/10 text-primary',
			},
		},
		defaultVariants: { variant: 'default' },
	},
);

export interface SbChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof chipVariants> {
	label: string;
	icon?: React.ReactNode;
}

export function SbChip({ label, icon, variant, className, type = 'button', ...props }: SbChipProps) {
	return (
		<button type={type} className={cn(chipVariants({ variant }), className)} {...props}>
			{icon}
			{label}
		</button>
	);
}
