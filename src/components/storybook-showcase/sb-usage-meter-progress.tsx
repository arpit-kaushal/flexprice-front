import { cn } from './lib/cn';
import { SbProgress } from './sb-progress';

export interface SbUsageMeterProgressProps {
	label: string;
	used: number;
	entitled: number;
	className?: string;
	percent?: number;
}

const fmt = (n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(n);

export function SbUsageMeterProgress({ label, used, entitled, percent, className }: SbUsageMeterProgressProps) {
	const safeEntitled = Math.max(entitled, 0);
	const derived = safeEntitled > 0 ? Math.min(100, (used / safeEntitled) * 100) : 0;
	const value = percent ?? derived;
	const sublabel = `${fmt(used)} / ${safeEntitled > 0 ? fmt(entitled) : '∞'} units`;

	return (
		<div className={cn('w-full space-y-2', className)}>
			<div className='flex items-baseline justify-between gap-2'>
				<p className='text-sm font-medium text-foreground'>{label}</p>
				<p className='text-xs tabular-nums text-muted-foreground'>{sublabel}</p>
			</div>
			<SbProgress value={value} trackClassName='bg-secondary' />
		</div>
	);
}
