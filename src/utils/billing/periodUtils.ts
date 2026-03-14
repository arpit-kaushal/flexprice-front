import { BILLING_PERIOD } from '@/constants/constants';
import { ENTITLEMENT_USAGE_RESET_PERIOD } from '@/models/Entitlement';

export interface Period {
	start: Date;
	end: Date;
}

/**
 * NextBillingDate calculates the next billing date based on the current period start,
 * billing anchor, billing period, and billing period unit.
 * The billing anchor determines the reference point for billing cycles:
 * - For MONTHLY periods, it sets the day of the month
 * - For ANNUAL periods, it sets the month and day of the year
 * - For WEEKLY/DAILY periods, it's used only for validation
 * If subscriptionEndDate is provided, the result will be cliffed to not exceed it.
 */
export function nextBillingDate(
	currentPeriodStart: Date,
	billingAnchor: Date,
	unit: number,
	period: BILLING_PERIOD,
	subscriptionEndDate?: Date | null,
): Date {
	if (unit <= 0) {
		throw new Error('billing period unit must be a positive integer');
	}

	const periodUpper = period.toUpperCase();

	// For daily and weekly periods, we can use simple addition
	if (periodUpper === BILLING_PERIOD.DAILY) {
		const anchorHour = billingAnchor.getHours();
		const anchorMin = billingAnchor.getMinutes();
		const anchorSec = billingAnchor.getSeconds();
		const nextDate = new Date(currentPeriodStart);
		nextDate.setDate(nextDate.getDate() + unit);
		nextDate.setHours(anchorHour, anchorMin, anchorSec, 0);
		if (subscriptionEndDate != null && nextDate.getTime() > subscriptionEndDate.getTime()) {
			return new Date(subscriptionEndDate.getTime());
		}
		return nextDate;
	}

	if (periodUpper === BILLING_PERIOD.WEEKLY) {
		const anchorWeekday = billingAnchor.getDay();
		const currentWeekday = currentPeriodStart.getDay();
		let daysToAdd = anchorWeekday - currentWeekday;
		if (daysToAdd < 0) {
			daysToAdd += 7;
		}
		daysToAdd += (unit - 1) * 7;
		if (anchorWeekday === currentWeekday) {
			daysToAdd = unit * 7;
		}
		const anchorHour = billingAnchor.getHours();
		const anchorMin = billingAnchor.getMinutes();
		const anchorSec = billingAnchor.getSeconds();
		const nextDate = new Date(currentPeriodStart);
		nextDate.setDate(nextDate.getDate() + daysToAdd);
		nextDate.setHours(anchorHour, anchorMin, anchorSec, 0);
		if (subscriptionEndDate != null && nextDate.getTime() > subscriptionEndDate.getTime()) {
			return new Date(subscriptionEndDate.getTime());
		}
		return nextDate;
	}

	// For monthly and annual periods, calculate the target year and month
	let years = 0;
	let months = 0;
	if (periodUpper === BILLING_PERIOD.MONTHLY) {
		months = unit;
	} else if (periodUpper === BILLING_PERIOD.ANNUAL) {
		years = unit;
	} else if (periodUpper === BILLING_PERIOD.QUARTERLY) {
		months = unit * 3;
	} else if (periodUpper === BILLING_PERIOD.HALF_YEARLY) {
		months = unit * 6;
	} else {
		throw new Error('invalid billing period type');
	}

	const y = currentPeriodStart.getFullYear();
	const m = currentPeriodStart.getMonth() + 1; // 1-12
	const h = billingAnchor.getHours();
	const min = billingAnchor.getMinutes();
	const sec = billingAnchor.getSeconds();

	let targetY = y + years;
	let targetM = m + months;

	// Adjust for month overflow/underflow
	while (targetM > 12) {
		targetM -= 12;
		targetY++;
	}
	while (targetM < 1) {
		targetM += 12;
		targetY--;
	}

	// For annual billing, preserve the billing anchor month
	if (periodUpper === BILLING_PERIOD.ANNUAL) {
		targetM = billingAnchor.getMonth() + 1;
	}

	let targetD = billingAnchor.getDate();

	// Find the last day of the target month (month is 1-12, JS Date uses 0-11)
	const lastDayOfMonth = new Date(targetY, targetM, 0).getDate();

	if (targetD > lastDayOfMonth) {
		targetD = lastDayOfMonth;
	}

	// Special case for February 29th in leap years
	if (
		periodUpper === BILLING_PERIOD.ANNUAL &&
		billingAnchor.getMonth() === 1 && // February
		billingAnchor.getDate() === 29 &&
		!isLeapYear(targetY)
	) {
		targetD = 28;
	}

	const nextDate = new Date(targetY, targetM - 1, targetD, h, min, sec, 0);

	if (subscriptionEndDate != null && nextDate.getTime() > subscriptionEndDate.getTime()) {
		return new Date(subscriptionEndDate.getTime());
	}

	return nextDate;
}

/**
 * CalculateBillingPeriods calculates all billing periods from an initial period start until an end date.
 */
export function calculateBillingPeriods(
	initialPeriodStart: Date,
	anchor: Date,
	periodCount: number,
	billingPeriod: BILLING_PERIOD,
	endDate?: Date | null,
): Period[] {
	const initialPeriodEnd = nextBillingDate(initialPeriodStart, anchor, periodCount, billingPeriod, endDate ?? undefined);

	const periods: Period[] = [{ start: new Date(initialPeriodStart.getTime()), end: initialPeriodEnd }];

	const boundaryEnd = endDate != null ? endDate : new Date();
	let currentEnd = initialPeriodEnd;

	while (currentEnd.getTime() < boundaryEnd.getTime()) {
		const nextStart = currentEnd;
		const nextEnd = nextBillingDate(nextStart, anchor, periodCount, billingPeriod, endDate ?? undefined);

		periods.push({ start: new Date(nextStart.getTime()), end: nextEnd });

		if (nextEnd.getTime() === currentEnd.getTime()) {
			break;
		}

		currentEnd = nextEnd;
	}

	return periods;
}

/**
 * PreviousBillingDate calculates the previous billing date by going backwards from the billing anchor.
 */
export function previousBillingDate(billingAnchor: Date, unit: number, period: BILLING_PERIOD): Date {
	if (unit <= 0) {
		throw new Error('billing period unit must be a positive integer');
	}

	const periodUpper = period.toUpperCase();

	if (periodUpper === BILLING_PERIOD.DAILY) {
		const d = new Date(billingAnchor.getTime());
		d.setDate(d.getDate() - unit);
		return d;
	}

	if (periodUpper === BILLING_PERIOD.WEEKLY) {
		const d = new Date(billingAnchor.getTime());
		d.setDate(d.getDate() - unit * 7);
		return d;
	}

	let years = 0;
	let months = 0;
	if (periodUpper === BILLING_PERIOD.MONTHLY) {
		months = -unit;
	} else if (periodUpper === BILLING_PERIOD.ANNUAL) {
		years = -unit;
	} else if (periodUpper === BILLING_PERIOD.QUARTERLY) {
		months = -unit * 3;
	} else if (periodUpper === BILLING_PERIOD.HALF_YEARLY) {
		months = -unit * 6;
	} else {
		throw new Error('invalid billing period type');
	}

	const y = billingAnchor.getFullYear();
	const m = billingAnchor.getMonth() + 1;
	const d = billingAnchor.getDate();
	const h = billingAnchor.getHours();
	const min = billingAnchor.getMinutes();
	const sec = billingAnchor.getSeconds();

	let targetY = y + years;
	let targetM = m + months;

	while (targetM > 12) {
		targetM -= 12;
		targetY++;
	}
	while (targetM < 1) {
		targetM += 12;
		targetY--;
	}

	if (periodUpper === BILLING_PERIOD.ANNUAL) {
		targetM = billingAnchor.getMonth() + 1;
	}

	let targetD = d;
	const lastDayOfMonth = new Date(targetY, targetM, 0).getDate();
	if (targetD > lastDayOfMonth) {
		targetD = lastDayOfMonth;
	}

	if (periodUpper === BILLING_PERIOD.ANNUAL && billingAnchor.getMonth() === 1 && billingAnchor.getDate() === 29 && !isLeapYear(targetY)) {
		targetD = 28;
	}

	return new Date(targetY, targetM - 1, targetD, h, min, sec, 0);
}

/**
 * CalculatePeriodID determines the appropriate billing period start for an event timestamp
 * and returns it as epoch millisecond timestamp (for ClickHouse period_id column).
 */
export function calculatePeriodID(
	eventTimestamp: Date,
	subStart: Date,
	currentPeriodStart: Date,
	currentPeriodEnd: Date,
	billingAnchor: Date,
	periodUnit: number,
	periodType: BILLING_PERIOD,
): number {
	if (eventTimestamp.getTime() < subStart.getTime()) {
		throw new Error('event timestamp is before subscription start date');
	}

	if (isBetween(eventTimestamp, currentPeriodStart, currentPeriodEnd)) {
		return periodStartToEpochMs(currentPeriodStart);
	}

	if (eventTimestamp.getTime() < currentPeriodStart.getTime()) {
		return findPeriodFromSubscriptionStart(eventTimestamp, subStart, currentPeriodStart, billingAnchor, periodUnit, periodType);
	}

	let periodStart = currentPeriodStart;

	for (let i = 0; i < 100; i++) {
		const nextPeriodStart = nextBillingDate(periodStart, billingAnchor, periodUnit, periodType, undefined);
		const nextPeriodEnd = nextBillingDate(nextPeriodStart, billingAnchor, periodUnit, periodType, undefined);

		if (isBetween(eventTimestamp, nextPeriodStart, nextPeriodEnd)) {
			return periodStartToEpochMs(nextPeriodStart);
		}

		periodStart = nextPeriodStart;
	}

	throw new Error('failed to find appropriate period for event timestamp');
}

/**
 * GetNextUsageResetAt calculates the next usage reset timestamp based on the entitlement usage reset period.
 */
export function getNextUsageResetAt(
	currentTime: Date,
	subscriptionStart: Date,
	billingAnchor: Date,
	entitlementUsageResetPeriod: ENTITLEMENT_USAGE_RESET_PERIOD,
	subscriptionEnd?: Date | null,
): Date {
	const periodUpper = entitlementUsageResetPeriod.toUpperCase();

	if (periodUpper === ENTITLEMENT_USAGE_RESET_PERIOD.NEVER) {
		return new Date(0);
	}

	if (periodUpper === ENTITLEMENT_USAGE_RESET_PERIOD.DAILY) {
		const nextDay = new Date(currentTime.getTime());
		nextDay.setDate(nextDay.getDate() + 1);
		const resetTime = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0, 0);

		if (subscriptionEnd != null && resetTime.getTime() > subscriptionEnd.getTime()) {
			return new Date(subscriptionEnd.getTime());
		}
		return resetTime;
	}

	if (periodUpper === ENTITLEMENT_USAGE_RESET_PERIOD.MONTHLY) {
		let periodStart = new Date(subscriptionStart.getTime());

		for (let i = 0; i < 1000; i++) {
			const periodEnd = nextBillingDate(periodStart, billingAnchor, 1, BILLING_PERIOD.MONTHLY, undefined);

			if (isBetween(currentTime, periodStart, periodEnd)) {
				const resetTime = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), periodEnd.getDate(), 0, 0, 0, 0);

				if (subscriptionEnd != null && resetTime.getTime() > subscriptionEnd.getTime()) {
					return new Date(subscriptionEnd.getTime());
				}
				return resetTime;
			}

			periodStart = periodEnd;

			if (periodStart.getTime() > currentTime.getTime() + 365 * 24 * 60 * 60 * 1000) {
				break;
			}
		}

		throw new Error('failed to find appropriate monthly period for usage reset');
	}

	throw new Error('Unsupported entitlement usage reset period. Only DAILY, MONTHLY, and NEVER are supported');
}

/** Backward-compatible wrapper: next billing date without subscription end. */
export function nextBillingDateLegacy(currentPeriodStart: Date, billingAnchor: Date, unit: number, period: BILLING_PERIOD): Date {
	return nextBillingDate(currentPeriodStart, billingAnchor, unit, period, undefined);
}

// --- Internal helpers ---

function isLeapYear(year: number): boolean {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isBetween(eventTimestamp: Date, periodStart: Date, periodEnd: Date): boolean {
	return (
		(eventTimestamp.getTime() === periodStart.getTime() || eventTimestamp.getTime() >= periodStart.getTime()) &&
		eventTimestamp.getTime() < periodEnd.getTime()
	);
}

function periodStartToEpochMs(periodStart: Date): number {
	return periodStart.getTime();
}

function findPeriodFromSubscriptionStart(
	eventTimestamp: Date,
	subStart: Date,
	currentPeriodStart: Date,
	billingAnchor: Date,
	periodUnit: number,
	periodType: BILLING_PERIOD,
): number {
	let periodStart = new Date(subStart.getTime());
	let periodEnd = nextBillingDate(periodStart, billingAnchor, periodUnit, periodType, undefined);

	for (let i = 0; i < 100; i++) {
		if (isBetween(eventTimestamp, periodStart, periodEnd)) {
			return periodStartToEpochMs(periodStart);
		}

		if (periodStart.getTime() >= currentPeriodStart.getTime()) {
			break;
		}

		const nextPeriodStart = periodEnd;
		periodEnd = nextBillingDate(nextPeriodStart, billingAnchor, periodUnit, periodType, undefined);
		periodStart = nextPeriodStart;
	}

	throw new Error('failed to find appropriate period for past event timestamp');
}
