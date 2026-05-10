import { describe, expect, it } from 'vitest';
import { formatAmount, formatCurrency, getCurrencySymbol } from './common';

describe('formatCurrency', () => {
	it('formats numeric amounts with the given ISO currency', () => {
		expect(formatCurrency(12.345, 'USD')).toMatch(/12\.35/);
		expect(formatCurrency('99', 'EUR')).toMatch(/99\.00/);
	});

	it('returns zero with symbol when amount is NaN', () => {
		const out = formatCurrency(Number.NaN, 'USD');
		expect(out).toMatch(/0\.00/);
		expect(out).toContain('$');
	});
});

describe('formatAmount', () => {
	it('returns fixed two decimals without currency symbol when currency omitted', () => {
		expect(formatAmount(10)).toBe('10.00');
		expect(formatAmount('3.1')).toBe('3.10');
	});

	it('delegates to formatCurrency when currency is provided', () => {
		const out = formatAmount(25, 'USD');
		expect(out).toMatch(/25\.00/);
		expect(out).toContain('$');
	});

	it('falls back for invalid numeric strings', () => {
		expect(formatAmount('not-a-number')).toBe('0.00');
	});
});

describe('getCurrencySymbol', () => {
	it('returns a symbol for supported ISO currencies', () => {
		expect(getCurrencySymbol('USD')).toBe('$');
		expect(getCurrencySymbol('EUR')).toContain('€');
	});

	it('returns the code unchanged when Intl rejects the currency', () => {
		expect(getCurrencySymbol('NOTREAL')).toBe('NOTREAL');
	});
});
