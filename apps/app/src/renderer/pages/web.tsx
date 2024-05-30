import { useLayoutEffect, useRef } from "react";

import { trpc } from "#renderer/trpc";

import type { Rectangle } from "electron";

export default function Web() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const viewIdRef = useRef<number | undefined>(undefined);
	const showRequestedRef = useRef(false);

	useLayoutEffect(() => {
		function updateBounds() {
			const container = containerRef.current;
			const viewId = viewIdRef.current;

			if (!(container && typeof viewId === "number")) return;

			void trpc.updateEmbeddedWebView.mutate({
				viewId,
				bounds: domRectToBounds(container.getBoundingClientRect()),
			});
		}

		function cleanup() {
			window.removeEventListener("resize", updateBounds);

			if (typeof viewIdRef.current === "number") {
				void trpc.removeEmbeddedWebView.mutate(viewIdRef.current);
			}
		}

		if (
			!(
				!showRequestedRef.current &&
				typeof viewIdRef.current !== "number" &&
				containerRef.current
			)
		) {
			return cleanup;
		}

		showRequestedRef.current = true;
		void trpc.showEmbeddedWebView
			.mutate({
				url: "http://localhost:3000",
				bounds: domRectToBounds(containerRef.current.getBoundingClientRect()),
			})
			.then((id) => (viewIdRef.current = id));

		window.addEventListener("resize", updateBounds);

		return cleanup;
	}, []);

	return <div className="size-full" ref={containerRef} />;
}

function domRectToBounds(rect: DOMRect): Rectangle {
	return {
		x: Math.round(rect.x),
		y: Math.round(rect.y),
		width: Math.round(rect.width),
		height: Math.round(rect.height),
	};
}
