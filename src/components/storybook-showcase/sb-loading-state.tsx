import { SbSpinIndicator } from './sb-spin-indicator';

export function SbLoadingState() {
	return (
		<div className='flex min-h-[200px] items-center justify-center text-muted-foreground' role='status' aria-label='Loading'>
			<SbSpinIndicator size={32} aria-hidden />
		</div>
	);
}
