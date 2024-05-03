import { createEffect, onCleanup } from "solid-js";

import { useTRPCClient } from "#renderer/contexts/trpc-client";

import type { Rectangle } from "electron";

export default function Web() {
	const trpc = useTRPCClient();
	let containerRef: HTMLDivElement | undefined = undefined;
	let viewId: number | undefined = undefined;

	function updateBounds() {
		if (!(containerRef && viewId)) return;

		void trpc.updateEmbeddedWebView.mutate({
			viewId,
			bounds: domRectToBounds(containerRef.getBoundingClientRect()),
		});
	}

	createEffect(() => {
		if (!containerRef) return;

		void trpc.showEmbeddedWebView
			.mutate({
				url: "http://localhost:3000",
				bounds: domRectToBounds(containerRef.getBoundingClientRect()),
			})
			.then((id) => (viewId = id));

		window.addEventListener("resize", updateBounds);
	});

	onCleanup(() => {
		window.removeEventListener("resize", updateBounds);

		if (viewId) void trpc.removeEmbeddedWebView.mutate(viewId);
	});

	return <div class="size-full" ref={(ref) => (containerRef = ref)} />;
}

function domRectToBounds(rect: DOMRect): Rectangle {
	return {
		x: Math.round(rect.x),
		y: Math.round(rect.y),
		width: Math.round(rect.width),
		height: Math.round(rect.height),
	};
}
