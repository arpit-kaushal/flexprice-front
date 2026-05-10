import type { ReactNode } from 'react';
import { cn } from './lib/cn';
import {
	getInvoiceStatusDisplayLabel,
	SB_INVOICE_STATUS_CODES as INV,
	type SbInvoiceBadgeStatus,
} from './lib/invoice-status-display-label';
import { SbIconBan, SbIconCheckCircle, SbIconFileEdit, SbIconSkipForward } from './sb-icons';

export type { SbInvoiceBadgeStatus };

export interface SbInvoiceStatusBadgeProps {
	status: SbInvoiceBadgeStatus;
}

const iconClass = 'size-3.5 shrink-0';

function row(label: string, icon: ReactNode, className: string) {
	return (
		<span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold', className)}>
			{icon}
			{label}
		</span>
	);
}

export function SbInvoiceStatusBadge({ status }: SbInvoiceStatusBadgeProps) {
	const key = status?.toUpperCase?.() ?? '';
	const label = getInvoiceStatusDisplayLabel(status);

	switch (key) {
		case INV.VOIDED:
			return row(label, <SbIconBan className={iconClass} />, 'border-destructive/40 bg-destructive/10 text-destructive');
		case INV.FINALIZED:
			return row(label, <SbIconCheckCircle className={iconClass} />, 'border-chart-2/30 bg-chart-2/10 text-chart-2');
		case INV.DRAFT:
			return row(label, <SbIconFileEdit className={iconClass} />, 'border-border bg-muted/60 text-foreground');
		case INV.SKIPPED:
			return row(
				label,
				<SbIconSkipForward className={iconClass} />,
				'border-blue/35 bg-blue-light text-blue dark:border-blue/40 dark:bg-blue/10 dark:text-blue',
			);
		case 'PAID':
			return row(label, <SbIconCheckCircle className={iconClass} />, 'border-chart-2/30 bg-chart-2/10 text-chart-2');
		default:
			return row(label, <SbIconFileEdit className={iconClass} />, 'border-border bg-muted/40');
	}
}
