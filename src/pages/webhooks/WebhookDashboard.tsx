import { Loader, Page } from '@/components/atoms';
import { ApiDocsContent } from '@/components/molecules/ApiDocs/ApiDocs';
import WebhookApi from '@/api/WebhookApi';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AppPortal } from 'svix-react';
import 'svix-react/style.css';
import { EmptyPage } from '@/components/organisms';
import { useMemo } from 'react';
import useEnvironment from '@/hooks/useEnvironment';
import { PrefetchQueryKey } from '@/config/prefetchConfig';

const WebhookDashboard = () => {
	const { activeEnvironment } = useEnvironment();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [PrefetchQueryKey.WebhookDashboardUrl, activeEnvironment?.id],
		queryFn: async () => await WebhookApi.getWebhookDashboardUrl(),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		enabled: !!activeEnvironment?.id,
	});

	// Memoize the AppPortal props to prevent unnecessary re-renders
	const appPortalProps = useMemo(
		() => ({
			primaryColor: '#000000',
			style: {
				width: '100%',
				height: '100%',
				color: '#000000',
				border: 'none',
				backgroundColor: '#000000',
			},
			url: data?.url ?? '',
		}),
		[data?.url],
	);

	if (isLoading) {
		return (
			<Page className='h-full w-full' heading='Webhooks'>
				<ApiDocsContent tags={['Webhooks']} />
				<div className='flex items-center justify-center h-96'>
					<Loader />
				</div>
			</Page>
		);
	}

	if (isError) {
		toast.error(`Error fetching webhook dashboard: ${error?.message || 'Unknown error'}`);
		return (
			<Page className='h-full w-full' heading='Webhooks'>
				<ApiDocsContent tags={['Webhooks']} />
				<EmptyPage
					heading='Webhooks'
					emptyStateCard={{
						heading: 'Unable to Load Webhooks',
						description: 'There was an error loading the webhook dashboard. Please try refreshing the page.',
					}}
				/>
			</Page>
		);
	}

	if (!data?.svix_enabled) {
		return (
			<Page className='h-full w-full' heading='Webhooks'>
				<ApiDocsContent tags={['Webhooks']} />
				<EmptyPage
					heading='Webhooks'
					emptyStateCard={{
						heading: 'Webhooks',
						description: 'Webhooks are not enabled. Please contact support to enable webhooks.',
					}}
				/>
			</Page>
		);
	}

	return (
		<Page className='h-full w-full' heading='Webhooks'>
			<ApiDocsContent tags={['Webhooks']} />
			<AppPortal {...appPortalProps} />
		</Page>
	);
};

export default WebhookDashboard;
