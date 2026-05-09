import { cn } from './lib/cn';
import { SbSpinIndicator } from './sb-spin-indicator';

export interface SbSpinnerProps {
	size?: number;
	className?: string;
}

export function SbSpinner({ size = 24, className }: SbSpinnerProps) {
	return <SbSpinIndicator size={size} className={cn('shrink-0', className)} aria-hidden />;
}
