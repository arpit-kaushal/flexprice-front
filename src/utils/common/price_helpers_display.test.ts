import { describe, expect, it } from 'vitest';
import type { Price } from '@/models/Price';
import { BILLING_MODEL, PRICE_UNIT_TYPE, TIER_MODE } from '@/models/Price';
import type { NormalizedPriceDisplay } from './price_helpers';
import { formatPriceDisplay, getActualPriceForTotal, getBillingModelLabel, getTierModeLabel } from './price_helpers';

describe('status / billing enum → human-readable labels', () => {
	describe('getBillingModelLabel', () => {
		it('maps billing models used in pricing config', () => {
			expect(getBillingModelLabel(BILLING_MODEL.FLAT_FEE)).toBe('Flat Fee');
			expect(getBillingModelLabel(BILLING_MODEL.PACKAGE)).toBe('Package');
			expect(getBillingModelLabel(BILLING_MODEL.TIERED)).toBe('Volume Tiered');
			expect(getBillingModelLabel('SLAB_TIERED')).toBe('Slab Tiered');
		});
	});

	describe('getTierModeLabel', () => {
		it('maps tier mode codes (volume vs slab)', () => {
			expect(getTierModeLabel(TIER_MODE.VOLUME)).toBe('Volume');
			expect(getTierModeLabel(TIER_MODE.SLAB)).toBe('Slab');
		});
	});
});

describe('tier / package price total helper (getActualPriceForTotal)', () => {
	it('uses list price for flat and package billing', () => {
		const flat = { price_unit_type: PRICE_UNIT_TYPE.FIAT, billing_model: BILLING_MODEL.FLAT_FEE, amount: '12.25' } as unknown as Price;
		expect(getActualPriceForTotal(flat)).toBe(12.25);

		const pkg = {
			price_unit_type: PRICE_UNIT_TYPE.FIAT,
			billing_model: BILLING_MODEL.PACKAGE,
			amount: '40',
		} as unknown as Price;
		expect(getActualPriceForTotal(pkg)).toBe(40);
	});

	it('for tiered billing takes the first tier flat_amount (UI total seed)', () => {
		const tiered = {
			price_unit_type: PRICE_UNIT_TYPE.FIAT,
			billing_model: BILLING_MODEL.TIERED,
			amount: '0',
			tiers: [{ flat_amount: '199.99', unit_amount: '0.01', up_to: 1_000_000 }],
		} as unknown as Price;
		expect(getActualPriceForTotal(tiered)).toBeCloseTo(199.99);
	});

	it('treats missing tier flat_amount as zero', () => {
		const tiered = {
			price_unit_type: PRICE_UNIT_TYPE.FIAT,
			billing_model: BILLING_MODEL.TIERED,
			amount: '50',
			tiers: [{ flat_amount: '', unit_amount: '1', up_to: 10 }],
		} as unknown as Price;
		expect(getActualPriceForTotal(tiered)).toBe(0);
	});
});

describe('normalized price string (formatPriceDisplay)', () => {
	const base: Omit<NormalizedPriceDisplay, 'billingModel' | 'tiers' | 'transformQuantity'> = {
		amount: '100',
		symbol: '$',
		tierMode: TIER_MODE.VOLUME,
		priceUnitType: PRICE_UNIT_TYPE.FIAT,
	};

	it('renders flat fee as symbol + formatted amount', () => {
		const normalized: NormalizedPriceDisplay = {
			...base,
			billingModel: BILLING_MODEL.FLAT_FEE,
			tiers: null,
			transformQuantity: null,
		};
		expect(formatPriceDisplay(normalized)).toBe('$100');
	});

	it('renders tiered pricing using the first tier unit amount', () => {
		const normalized: NormalizedPriceDisplay = {
			...base,
			amount: '0',
			billingModel: BILLING_MODEL.TIERED,
			tiers: [{ unit_amount: '0.05', up_to: 1000 }],
			transformQuantity: null,
		};
		expect(formatPriceDisplay(normalized)).toBe('starts at $0.05 per unit');
	});

	it('renders package pricing with transform quantity', () => {
		const normalized: NormalizedPriceDisplay = {
			...base,
			billingModel: BILLING_MODEL.PACKAGE,
			tiers: null,
			transformQuantity: { divide_by: 1000 },
		};
		expect(formatPriceDisplay(normalized)).toBe('$100 / 1000 units');
	});
});
