import * as React from 'react';
import { cn } from './lib/cn';

export interface SbCardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'notched' | 'bordered' | 'elevated' | 'warning';
}

export function SbCard({ className, variant = 'default', children, ...props }: SbCardProps) {
	return (
		<div
			className={cn(
				'rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm',
				variant === 'elevated' && 'shadow-md',
				variant === 'warning' &&
					'border-blue/40 bg-blue-light text-card-foreground dark:border-blue/35 dark:bg-blue/10 dark:text-card-foreground',
				variant === 'notched' && 'border-l-4 border-l-primary',
				variant === 'bordered' && 'shadow-none',
				className,
			)}
			{...props}>
			{children}
		</div>
	);
}

export interface SbCardHeaderProps {
	title: string;
	subtitle?: string;
	cta?: React.ReactNode;
}

export function SbCardHeader({ title, subtitle, cta }: SbCardHeaderProps) {
	return (
		<div className='mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3'>
			<div>
				<h3 className='text-base font-semibold leading-tight'>{title}</h3>
				{subtitle ? <p className='mt-1 text-sm text-muted-foreground'>{subtitle}</p> : null}
			</div>
			{cta}
		</div>
	);
}
