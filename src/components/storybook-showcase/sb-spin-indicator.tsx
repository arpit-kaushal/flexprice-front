import * as React from 'react';
import { cn } from './lib/cn';

export interface SbSpinIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
	/** Pixel size (width and height). */
	size?: number;
}

/** Inline loading spinner — SVG + Tailwind spin, no icon font / Lucide. */
export function SbSpinIndicator({ className, size = 16, ...props }: SbSpinIndicatorProps) {
	return (
		<svg
			className={cn('animate-spin', className)}
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			role='presentation'
			{...props}>
			<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
			<path
				className='opacity-75'
				fill='currentColor'
				d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
			/>
		</svg>
	);
}
