import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { tryOr } from "#common/lib/error";
import { normalizeBigint } from "#common/lib/number";
import { useResizeObserver } from "#renderer/hooks/use-resize-observer";
import { tm } from "#renderer/lib/style";

import type { Accessor } from "solid-js";

export interface Sample {
	value: bigint;
}

function normalizeValues(
	samples: Sample[],
	min: bigint,
	max: bigint,
): number[] {
	return samples.map(({ value }) => {
		return tryOr(() => normalizeBigint(value, min, max), 0.5);
	});
}

function drawGraph(canvas: HTMLCanvasElement, normalized: number[]) {
	const ctx = canvas.getContext("2d");

	if (!ctx) return;

	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const scale = devicePixelRatio;
	const canvasStyles = getComputedStyle(canvas);
	const step = width / Math.max(normalized.length - 1, 1);
	const getY = (val: number) => (1 - val) * height;
	const gutter = 2;

	canvas.width = width * scale;
	canvas.height = height * scale;

	ctx.scale(scale, scale);
	ctx.clearRect(0, 0, width, height);

	ctx.strokeStyle = canvasStyles.color;
	ctx.fillStyle = canvasStyles.borderColor;

	ctx.beginPath();
	ctx.moveTo(-gutter, height + gutter);
	ctx.lineTo(-gutter, getY(normalized[0] ?? 1));

	for (let i = 0; i < normalized.length; i++) {
		ctx.lineTo(i * step, getY(normalized[i] ?? 0.5));
	}

	ctx.lineTo(width + gutter, getY(normalized.at(-1) ?? 0.5));
	ctx.lineTo(width + gutter, height + gutter);
	ctx.lineTo(width + gutter, height + gutter);
	ctx.moveTo(-gutter, height + gutter);
	ctx.closePath();

	ctx.stroke();
	ctx.fill();
}

export function ChronoGraph(props: {
	sampleSource: Accessor<Sample | undefined>;
	minValue?: bigint | undefined;
	maxValue?: bigint | undefined;
	maxSamples?: number | undefined;
	class?: string | undefined;
}) {
	const schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const observeResize = useResizeObserver();
	let unobserveResize: ReturnType<typeof observeResize> | undefined;
	let canvasEl: HTMLCanvasElement | undefined;
	let rollingMin = BigInt(0);
	let rollingMax = BigInt(0);

	const [samples, setSamples] = createSignal<Sample[]>([]);
	const normalizedValues = createMemo(() => {
		return normalizeValues(
			samples(),
			props.minValue ?? rollingMin,
			props.maxValue ?? rollingMax,
		);
	});

	createEffect(() => {
		const sample = props.sampleSource();

		if (!sample) return;

		if (sample.value < rollingMin) rollingMin = sample.value;
		else if (sample.value > rollingMax) rollingMax = sample.value;

		const maxSamples = props.maxSamples ?? 20;

		setSamples((current) => {
			return current
				.slice(Math.max(current.length - (maxSamples - 1), 0))
				.concat(sample);
		});
	});

	function redraw() {
		if (canvasEl) drawGraph(canvasEl, normalizedValues());
	}

	createEffect(redraw);
	schemeQuery.addEventListener("change", redraw);

	onCleanup(() => {
		unobserveResize?.();
		schemeQuery.removeEventListener("change", redraw);
	});

	return (
		<canvas
			class={tm(
				"size-full border-muted/60 bg-muted/30 text-accent-foreground",
				props.class,
			)}
			ref={(el) => {
				canvasEl = el;
				unobserveResize = observeResize(canvasEl, redraw);
			}}
		/>
	);
}
