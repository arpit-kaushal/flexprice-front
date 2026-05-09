import { cn } from './lib/cn';

export interface SbDividerProps {
	width?: string;
	alignment?: 'left' | 'center' | 'right';
	color?: string;
	className?: string;
}

export function SbDivider({ width = '100%', alignment = 'center', color = 'hsl(var(--border))', className }: SbDividerProps) {
	const justify = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';
	return (
		<div className={cn('flex w-full', justify, className)} role='separator'>
			<hr className='border-0 border-t' style={{ width, borderColor: color }} />
		</div>
	);
}
