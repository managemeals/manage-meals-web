import Tooltip from '$lib/components/Tooltip.svelte';

export const tooltip = (node: any) => {
	let title: string;
	let tooltipComponent: any;

	const mouseOver = (event: any) => {
		title = node.getAttribute('title');
		node.removeAttribute('title');

		tooltipComponent = new Tooltip({
			props: {
				title: title,
				x: event.pageX,
				y: event.pageY
			},
			target: document.body
		});
	};

	const mouseMove = (event: any) => {
		tooltipComponent.$set({
			x: event.pageX,
			y: event.pageY
		});
	};
	const mouseLeave = () => {
		tooltipComponent.$destroy();
		node.setAttribute('title', title);
	};

	node.addEventListener('mouseover', mouseOver);
	node.addEventListener('mouseleave', mouseLeave);
	node.addEventListener('mousemove', mouseMove);

	return {
		destroy() {
			node.removeEventListener('mouseover', mouseOver);
			node.removeEventListener('mouseleave', mouseLeave);
			node.removeEventListener('mousemove', mouseMove);
		}
	};
};
