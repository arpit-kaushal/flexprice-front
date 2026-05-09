import { cn } from './lib/cn';
import { SbIconTrendingDown, SbIconTrendingUp } from './sb-icons';

export interface SbMetricCardProps {
	title: string;
	value: number;
	currency?: string;
	isPercent?: boolean;
	showChangeIndicator?: boolean;
	isNegative?: boolean;
}

function formatDisplay(value: number, currency: string | undefined, isPercent: boolean): string {
	if (isPercent) {
		return `${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}%`;
	}
	if (currency) {
		const code = currency.length === 3 ? currency.toUpperCase() : currency;
		try {
			return new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency: code,
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(value);
		} catch {
			return `${code} ${value.toFixed(2)}`;
		}
	}
	return new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

export function SbMetricCard({
	title,
	value,
	currency,
	isPercent = false,
	showChangeIndicator = false,
	isNegative = false,
}: SbMetricCardProps) {
	const trendClass = isNegative ? 'text-destructive' : 'text-chart-2';

	return (
		<div
			className={cn(
				'flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm',
				'ring-offset-background transition-shadow hover:shadow-md',
			)}>
			<p className='text-sm font-medium text-muted-foreground'>{title}</p>
			<p className='flex items-center gap-2 text-2xl font-semibold tabular-nums text-foreground'>
				<span>{formatDisplay(value, currency, isPercent)}</span>
				{showChangeIndicator ? (
					<span className={cn('inline-flex', trendClass)} aria-hidden>
						{isNegative ? <SbIconTrendingDown className='size-5' /> : <SbIconTrendingUp className='size-5' />}
					</span>
				) : null}
			</p>
		</div>
	);
}
