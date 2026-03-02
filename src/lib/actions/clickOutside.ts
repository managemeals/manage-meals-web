import type { Action } from 'svelte/action';

/**
 * Dispatch an event when a user clicks outside node
 * or any of the optional extraNodes.
 */
export const clickOutside: Action<Element, Element[] | undefined> = (node, extraNodes) => {
	// eslint-disable-next-line
	const handleClick = (event: any) => {
		if (!node || node.contains(event.target) || event.defaultPrevented) {
			return;
		}
		for (const extraNode of extraNodes || []) {
			if (extraNode.contains(event.target)) {
				return;
			}
		}
		node.dispatchEvent(new CustomEvent('clickoutside'));
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
