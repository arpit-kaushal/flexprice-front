import type { Meta, StoryObj } from '@storybook/react';
import { storyChromeDecorators } from './preview-decorator';
import { SbCard, SbCardHeader } from './sb-card';
import { QUERY_DEFAULTS, QUERY_PRESETS, createQueryConfig } from '@/core/services/tanstack/createQueryConfig';

const meta: Meta = {
	title: 'Showcase/Guides/QueryCacheConfig',
	tags: ['autodocs'],
	decorators: storyChromeDecorators,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Reference for `createQueryConfig` + `QUERY_PRESETS`. No live fetching — textual matrix only alongside the **Default** JSON snippet.',
			},
		},
	},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<div className='max-w-lg space-y-3 rounded-md border border-border bg-muted/20 p-4 font-mono text-xs'>
			<p className='font-sans text-sm font-medium text-foreground'>QUERY_DEFAULTS → QueryClient</p>
			<pre className='overflow-x-auto whitespace-pre-wrap text-muted-foreground'>{JSON.stringify(QUERY_DEFAULTS, null, 2)}</pre>
			<p className='font-sans text-xs text-muted-foreground'>Spread `createQueryConfig()` when you only need the canonical numbers.</p>
			<pre className='overflow-x-auto whitespace-pre-wrap text-muted-foreground'>{JSON.stringify(createQueryConfig(), null, 2)}</pre>
		</div>
	),
};

export const Variants: Story = {
	render: () => <ConfigMatrix />,
};

function ConfigMatrix() {
	const rows = [
		{ label: "createQueryConfig({ preset: 'REALTIME' })", value: createQueryConfig({ preset: 'REALTIME' }) },
		{ label: "createQueryConfig({ preset: 'DEFAULT' })", value: createQueryConfig({ preset: 'DEFAULT' }) },
		{ label: "createQueryConfig({ preset: 'STATIC' })", value: createQueryConfig({ preset: 'STATIC' }) },
		{
			label: "createQueryConfig({ preset: 'STATIC', staleTime: 0 }) — explicit override",
			value: createQueryConfig({ preset: 'STATIC', staleTime: 0 }),
		},
		{ label: 'QUERY_PRESETS (authoritative map)', value: QUERY_PRESETS },
	] as const;

	return (
		<div className='space-y-4'>
			<SbCard>
				<SbCardHeader
					title='Caching presets'
					subtitle='Example: useQuery({ queryKey, queryFn, ...createQueryConfig({ preset: "REALTIME" }) })'
				/>
				<ul className='list-inside list-disc space-y-1 text-sm text-muted-foreground'>
					<li>
						<strong className='text-foreground'>REALTIME</strong> — `staleTime: 0`.
					</li>
					<li>
						<strong className='text-foreground'>DEFAULT</strong> — `5m / 10m` (matches QueryClient defaults in this repo).
					</li>
					<li>
						<strong className='text-foreground'>STATIC</strong> — `30m / 10m` for seldom-changing reference data.
					</li>
				</ul>
			</SbCard>
			<div className='space-y-3'>
				{rows.map((r) => (
					<div key={r.label} className='rounded-md border border-border bg-muted/30 p-3 font-mono text-xs'>
						<p className='mb-1 font-sans text-sm font-medium text-foreground'>{r.label}</p>
						<pre className='overflow-x-auto whitespace-pre-wrap text-muted-foreground'>{JSON.stringify(r.value, null, 2)}</pre>
					</div>
				))}
			</div>
		</div>
	);
}
