export const QUERY_DEFAULTS = {
	staleTime: 5 * 60 * 1000,
	gcTime: 10 * 60 * 1000,
} as const;

export const QUERY_PRESETS = {
	REALTIME: { staleTime: 0, gcTime: QUERY_DEFAULTS.gcTime } as const,
	DEFAULT: QUERY_DEFAULTS,
	STATIC: { staleTime: 30 * 60 * 1000, gcTime: QUERY_DEFAULTS.gcTime } as const,
} as const;

export type QueryCachePreset = keyof typeof QUERY_PRESETS;

export type QueryTimeSlice = { staleTime?: number; gcTime?: number };

export function createQueryConfig(overrides?: Partial<QueryTimeSlice> & { preset?: QueryCachePreset }): QueryTimeSlice {
	const preset = overrides?.preset ? QUERY_PRESETS[overrides.preset] : QUERY_PRESETS.DEFAULT;
	return {
		staleTime: overrides?.staleTime ?? preset.staleTime,
		gcTime: overrides?.gcTime ?? preset.gcTime,
	};
}
