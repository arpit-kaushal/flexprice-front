import WebhookApi from '@/api/WebhookApi';

/** Canonical query key strings — import this enum in both prefetchConfig and useQuery calls */
export enum PrefetchQueryKey {
	WebhookDashboardUrl = 'webhookDashboardUrl',
}

export interface PrefetchConfig {
	queryKey: (envId: string) => unknown[];
	queryFn: (envId: string) => Promise<unknown>;
	/** how long cached data stays fresh */
	staleTime: number;
	/** how long cached data stays in memory */
	gcTime: number;
}

export const PREFETCH_REGISTRY: PrefetchConfig[] = [
	{
		queryKey: (envId) => [PrefetchQueryKey.WebhookDashboardUrl, envId],
		queryFn: async () => await WebhookApi.getWebhookDashboardUrl(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	},
];
