export interface RevenueDashboardRequest {
	period_start: string;
	period_end: string;
	customer_ids: string[];
}

export interface RevenueDashboardSummary {
	total_revenue: number;
	total_usage_revenue: number;
	total_fixed_revenue: number;
	cost_per_minute: number;
	voice_minutes: number;
}

export interface RevenueDashboardItem {
	customer_id: string;
	external_customer_id: string;
	customer_name: string;
	total_usage_revenue: number;
	total_fixed_revenue: number;
	cost_per_minute: number;
	voice_minutes: number;
}

export interface RevenueDashboardResponse {
	summary: RevenueDashboardSummary;
	items: RevenueDashboardItem[];
}
