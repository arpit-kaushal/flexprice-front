import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useStore } from 'zustand/react';
import { computeFilterFingerprint } from '@/lib/filterFingerprint';

export type FilterValues = Record<string, unknown>;

const DEFAULT_URL_PARAM = 'fq';

function writeUrlFingerprint(param: string, fingerprint: string): void {
	if (typeof window === 'undefined') return;
	const url = new URL(window.location.href);
	const prev = url.searchParams.get(param);
	if (prev === fingerprint) return;
	if (fingerprint.length === 0) {
		url.searchParams.delete(param);
	} else {
		url.searchParams.set(param, fingerprint);
	}
	window.history.replaceState(window.history.state, '', url.toString());
}

type FilterStoreState = {
	filters: FilterValues;
	setFilter: (key: string, value: unknown) => void;
	resetFilters: () => void;
	getFilters: () => FilterValues;
};

function createFilterStore(routeKey: string, urlParam: string) {
	const storageKey = `filters:${routeKey}`;
	return create<FilterStoreState>()(
		persist(
			(set, get) => ({
				filters: {},
				setFilter: (key, value) => {
					set((s) => {
						const next = { ...s.filters, [key]: value };
						queueMicrotask(() => writeUrlFingerprint(urlParam, computeFilterFingerprint(next)));
						return { filters: next };
					});
				},
				resetFilters: () => {
					set({ filters: {} });
					queueMicrotask(() => writeUrlFingerprint(urlParam, computeFilterFingerprint({})));
				},
				getFilters: () => get().filters,
			}),
			{
				name: storageKey,
				storage: createJSONStorage(() => sessionStorage),
				partialize: (state) => ({ filters: state.filters }),
				onRehydrateStorage: () => (state) => {
					if (state) {
						queueMicrotask(() => writeUrlFingerprint(urlParam, computeFilterFingerprint(state.filters)));
					}
				},
			},
		),
	);
}

type FilterStore = ReturnType<typeof createFilterStore>;

const storeCache = new Map<string, FilterStore>();

function getFilterStore(routeKey: string, urlParam: string): FilterStore {
	const cacheKey = `${routeKey}:${urlParam}`;
	let s = storeCache.get(cacheKey);
	if (!s) {
		s = createFilterStore(routeKey, urlParam);
		storeCache.set(cacheKey, s);
	}
	return s;
}

export interface UseFilterStoreOptions {
	urlParam?: string;
}

export function useFilterStore(routeKey: string, options?: UseFilterStoreOptions) {
	const urlParam = options?.urlParam ?? DEFAULT_URL_PARAM;
	const store = useMemo(() => getFilterStore(routeKey, urlParam), [routeKey, urlParam]);

	const filters = useStore(store, (s) => s.filters);
	const setFilter = useStore(store, (s) => s.setFilter);
	const resetFilters = useStore(store, (s) => s.resetFilters);
	const getFilters = useMemo(() => () => store.getState().getFilters(), [store]);

	const fingerprint = useMemo(() => computeFilterFingerprint(filters), [filters]);

	return {
		filters,
		setFilter,
		resetFilters,
		getFilters,
		fingerprint,
		urlParam,
	};
}
