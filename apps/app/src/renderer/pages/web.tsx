import { useLayoutEffect, useRef } from "react";

import { trpc } from "#renderer/trpc";

import type { Rectangle } from "electron";

export default function Web() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const viewIdRef = useRef<number | undefined>(undefined);
	const showRequestedRef = useRef(false);
	const { mutate: showEmbeddedWebView } = trpc.showEmbeddedWebView.useMutation({
		onMutate(variables) {
			showRequestedRef.current = true;

			return variables;
		},
		onSuccess(viewId) {
			viewIdRef.current = viewId;
		},
	});
	const { mutate: updateEmbeddedWebView } =
		trpc.updateEmbeddedWebView.useMutation();
	const { mutate: removeEmbeddedWebView } =
		trpc.removeEmbeddedWebView.useMutation();

	useLayoutEffect(() => {
		function updateBounds() {
			const container = containerRef.current;
			const viewId = viewIdRef.current;

			if (!(container && typeof viewId === "number")) return;

			updateEmbeddedWebView({
				viewId,
				bounds: domRectToBounds(container.getBoundingClientRect()),
			});
		}

		function cleanup() {
			window.removeEventListener("resize", updateBounds);

			if (typeof viewIdRef.current === "number") {
				removeEmbeddedWebView(viewIdRef.current);
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
		showEmbeddedWebView({
			url: "http://localhost:3000",
			bounds: domRectToBounds(containerRef.current.getBoundingClientRect()),
		});

		window.addEventListener("resize", updateBounds);

		return cleanup;
	}, [removeEmbeddedWebView, showEmbeddedWebView, updateEmbeddedWebView]);

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
