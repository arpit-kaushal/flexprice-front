import * as Tooltip from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from './lib/cn';

export const SbTooltipProvider = Tooltip.Provider;

export function SbTooltip({ children, delayDuration = 0 }: { children: React.ReactNode; delayDuration?: number }) {
	return <Tooltip.Root delayDuration={delayDuration}>{children}</Tooltip.Root>;
}

export const SbTooltipTrigger = Tooltip.Trigger;
export const SbTooltipContent = React.forwardRef<
	React.ElementRef<typeof Tooltip.Content>,
	React.ComponentPropsWithoutRef<typeof Tooltip.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<Tooltip.Portal>
		<Tooltip.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 max-w-xs overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
				className,
			)}
			{...props}
		/>
	</Tooltip.Portal>
));
SbTooltipContent.displayName = 'SbTooltipContent';
