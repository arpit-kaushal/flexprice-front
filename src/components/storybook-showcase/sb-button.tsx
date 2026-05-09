import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from './lib/cn';
import { SbSlot } from './sb-slot';
import { SbSpinIndicator } from './sb-spin-indicator';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				sm: 'h-8 rounded-md px-3 text-xs',
				md: 'h-9 px-4 py-2',
				lg: 'h-10 rounded-md px-8',
			},
		},
		defaultVariants: { variant: 'default', size: 'md' },
	},
);

export interface SbButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

export const SbButton = React.forwardRef<HTMLButtonElement, SbButtonProps>(
	({ className, variant, size, asChild = false, isLoading, disabled, children, ...props }, ref) => {
		// SbSlot merges onto one child; loading adds a second node — fall back to <button> while loading.
		const useSlot = Boolean(asChild && !isLoading);
		const Comp = useSlot ? SbSlot : 'button';
		return (
			<Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} disabled={disabled || isLoading} {...props}>
				{isLoading ? <SbSpinIndicator size={16} className='shrink-0' aria-hidden /> : null}
				{children}
			</Comp>
		);
	},
);
SbButton.displayName = 'SbButton';
