import { cn } from './lib/cn';

export interface SbPricingTierRow {
	from: number;
	upTo: number | null;
	unitPrice: string;
	flatFee: string;
}

export interface SbPricingTierTableProps {
	tiers: SbPricingTierRow[];
	currencyLabel?: string;
	className?: string;
}

export function SbPricingTierTable({ tiers, currencyLabel = 'USD', className }: SbPricingTierTableProps) {
	return (
		<div className={cn('w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm', className)}>
			<table className='w-full caption-bottom text-sm'>
				<thead className='bg-muted/80'>
					<tr className='border-b border-border'>
						<th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
							From <span className='font-normal normal-case text-muted-foreground/80'>{'(>)'}</span>
						</th>
						<th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
							Up to <span className='font-normal normal-case text-muted-foreground/80'>{'(<=)'}</span>
						</th>
						<th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{`Per unit (${currencyLabel})`}</th>
						<th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{`Flat fee (${currencyLabel})`}</th>
					</tr>
				</thead>
				<tbody>
					{tiers.map((tier, i) => (
						<tr key={i} className='border-b border-border last:border-0 hover:bg-muted/30'>
							<td className='px-4 py-3 font-medium tabular-nums text-foreground'>{tier.from}</td>
							<td className='px-4 py-3 tabular-nums text-muted-foreground'>{tier.upTo === null ? '∞' : tier.upTo}</td>
							<td className='px-4 py-3 tabular-nums text-foreground'>{tier.unitPrice}</td>
							<td className='px-4 py-3 tabular-nums text-foreground'>{tier.flatFee}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
