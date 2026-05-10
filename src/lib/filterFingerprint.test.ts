import { describe, expect, it } from 'vitest';
import { computeFilterFingerprint, stableStringify } from './filterFingerprint';

describe('filterFingerprint', () => {
	it('stableStringify is order-independent for objects', () => {
		expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
	});

	it('computeFilterFingerprint stays stable for same logical filters', () => {
		expect(computeFilterFingerprint({ status: 'open', page: 1 })).toBe(computeFilterFingerprint({ page: 1, status: 'open' }));
	});

	it('changes when values change', () => {
		const a = computeFilterFingerprint({ q: 'a' });
		const b = computeFilterFingerprint({ q: 'b' });
		expect(a).not.toBe(b);
	});
});
