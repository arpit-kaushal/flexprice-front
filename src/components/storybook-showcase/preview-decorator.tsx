import type { Decorator } from '@storybook/react';
import '../../index.css';
import { SbTooltipProvider } from './sb-tooltip';

export const storyChromeDecorators: Decorator[] = [
	(Story) => (
		<SbTooltipProvider delayDuration={300}>
			<div className='min-h-0 bg-background px-4 py-6 text-foreground antialiased'>
				<Story />
			</div>
		</SbTooltipProvider>
	),
];
