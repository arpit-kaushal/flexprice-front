import { describe, expect, it } from 'vitest';
import { QUERY_DEFAULTS, QUERY_PRESETS, createQueryConfig } from './createQueryConfig';

describe('createQueryConfig', () => {
	it('defaults to 5m stale and 10m gc', () => {
		expect(createQueryConfig()).toEqual({
			staleTime: QUERY_DEFAULTS.staleTime,
			gcTime: QUERY_DEFAULTS.gcTime,
		});
	});

	it('REALTIME preset forces stale data immediately', () => {
		expect(createQueryConfig({ preset: 'REALTIME' })).toEqual({
			staleTime: 0,
			gcTime: QUERY_PRESETS.REALTIME.gcTime,
		});
	});

	it('STATIC preset extends staleTime to 30 minutes', () => {
		expect(createQueryConfig({ preset: 'STATIC' })).toEqual({
			staleTime: 30 * 60 * 1000,
			gcTime: QUERY_DEFAULTS.gcTime,
		});
	});

	it('allows call-site overrides after preset', () => {
		expect(createQueryConfig({ preset: 'STATIC', staleTime: 0 })).toEqual({
			staleTime: 0,
			gcTime: QUERY_DEFAULTS.gcTime,
		});
		expect(createQueryConfig({ preset: 'REALTIME', gcTime: 60_000 })).toEqual({
			staleTime: 0,
			gcTime: 60_000,
		});
	});
});
