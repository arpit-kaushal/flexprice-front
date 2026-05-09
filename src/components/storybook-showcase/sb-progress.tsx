import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from './lib/cn';

export interface SbProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	label?: React.ReactNode;
	labelClassName?: string;
	indicatorClassName?: string;
	trackClassName?: string;
}

export const SbProgress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, SbProgressProps>(
	({ className, value, label, labelClassName, indicatorClassName, trackClassName, ...props }, ref) => (
		<div className='w-full space-y-1'>
			{label ? <div className={cn('flex justify-between text-xs', labelClassName)}>{label}</div> : null}
			<ProgressPrimitive.Root
				ref={ref}
				className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', trackClassName, className)}
				{...props}>
				<ProgressPrimitive.Indicator
					className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorClassName)}
					style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
				/>
			</ProgressPrimitive.Root>
		</div>
	),
);
SbProgress.displayName = 'SbProgress';
