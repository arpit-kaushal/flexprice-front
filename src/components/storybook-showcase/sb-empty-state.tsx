import type { FC, ReactNode } from 'react';
import { cn } from './lib/cn';
import { SbButton } from './sb-button';

export interface SbEmptyStateProps {
	icon?: ReactNode;
	headline: string;
	description?: ReactNode;
	ctaLabel?: string;
	onCtaClick?: () => void;
	className?: string;
}

export const SbEmptyState: FC<SbEmptyStateProps> = ({ icon, headline, description, ctaLabel, onCtaClick, className }) => (
	<div
		className={cn(
			'flex w-full max-w-lg flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-8 py-14 text-center',
			className,
		)}>
		{icon ? <div className='mb-6 text-muted-foreground [&_svg]:size-10'>{icon}</div> : null}
		<h2 className='mb-2 text-lg font-semibold tracking-tight text-foreground'>{headline}</h2>
		{description ? <div className='mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground'>{description}</div> : null}
		{ctaLabel && onCtaClick ? (
			<SbButton variant='secondary' size='sm' onClick={onCtaClick}>
				{ctaLabel}
			</SbButton>
		) : null}
	</div>
);
