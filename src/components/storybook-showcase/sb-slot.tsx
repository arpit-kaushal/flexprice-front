import * as React from 'react';
import { cn } from './lib/cn';
import { mergeRefs } from './lib/merge-refs';

type UnknownRecord = Record<string, unknown>;

function mergeSlotProps(slotProps: UnknownRecord, childProps: UnknownRecord): UnknownRecord {
	const result: UnknownRecord = { ...childProps, ...slotProps };

	for (const key of Object.keys(slotProps)) {
		if (!key.startsWith('on')) continue;
		const slotHandler = slotProps[key];
		const childHandler = childProps[key];
		if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
			result[key] = (...args: unknown[]) => {
				(childHandler as (...a: unknown[]) => void)(...args);
				(slotHandler as (...a: unknown[]) => void)(...args);
			};
		}
	}

	if (childProps.className != null || slotProps.className != null) {
		result.className = cn(String(childProps.className ?? ''), String(slotProps.className ?? ''));
	}

	const styleChild = childProps.style as React.CSSProperties | undefined;
	const styleSlot = slotProps.style as React.CSSProperties | undefined;
	if (styleChild || styleSlot) {
		result.style = { ...styleChild, ...styleSlot };
	}

	return result;
}

export type SbSlotProps = {
	children?: React.ReactNode;
} & UnknownRecord;

export const SbSlot = React.forwardRef<unknown, SbSlotProps>(function SbSlot({ children, ...slotProps }, forwardedRef) {
	if (!React.isValidElement(children)) {
		throw new Error('SbSlot requires a single valid React element child.');
	}
	const child = children as React.ReactElement<UnknownRecord>;
	const childProps = (child.props ?? {}) as UnknownRecord;
	const merged = mergeSlotProps(slotProps, childProps);
	const childRef = (child as unknown as { ref?: React.Ref<unknown> }).ref;

	return React.cloneElement(child, {
		...merged,
		ref: mergeRefs(forwardedRef, childRef),
	} as never);
});

SbSlot.displayName = 'SbSlot';
