import * as React from 'react';

export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
	return (instance) => {
		for (const ref of refs) {
			if (ref == null) continue;
			if (typeof ref === 'function') {
				ref(instance);
			} else {
				(ref as React.MutableRefObject<T | null>).current = instance;
			}
		}
	};
}
