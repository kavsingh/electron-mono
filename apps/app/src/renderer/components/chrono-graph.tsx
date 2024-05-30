import { useCallback, useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";

import { tryOr } from "#common/lib/error";
import { normalizeBigint } from "#common/lib/number";
import { useResizeObserver } from "#renderer/hooks/use-resize-observer";

import type { VariantProps } from "tailwind-variants";

export default function ChronoGraph(
	props: {
		sampleSource: Sample | undefined;
		minValue?: bigint | undefined;
		maxValue?: bigint | undefined;
		maxSamples?: number | undefined;
		class?: string | undefined;
	} & VariantProps<typeof chronoGraphVariants>,
) {
	const schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const observeResize = useResizeObserver();
	let unobserveResize: ReturnType<typeof observeResize> | undefined;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rollingMin = useRef(0n);
	const rollingMax = useRef(0n);

	const [samples, setSamples] = useState<Sample[]>([]);
	const normalizedValues = normalizeValues(
		samples,
		props.minValue ?? rollingMin.current,
		props.maxValue ?? rollingMax.current,
	);

	useEffect(() => {
		const sample = props.sampleSource;

		if (!sample) return;

		if (sample.value < rollingMin.current) {
			rollingMin.current = sample.value;
		} else if (sample.value > rollingMax.current) {
			rollingMax.current = sample.value;
		}

		const maxSamples = props.maxSamples ?? 20;

		setSamples((current) => {
			return current
				.slice(Math.max(current.length - (maxSamples - 1), 0))
				.concat(sample);
		});
	}, [props.maxSamples, props.sampleSource]);

	const redraw = useCallback(() => {
		if (canvasRef.current) drawGraph(canvasRef.current, normalizedValues);
	}, [normalizedValues]);

	useEffect(() => {
		redraw();
	}, [redraw]);

	useEffect(() => {
		schemeQuery.addEventListener("change", redraw);

		return function cleanup() {
			schemeQuery.removeEventListener("change", redraw);
			unobserveResize?.();
		};
	}, [redraw, schemeQuery, unobserveResize]);

	return (
		<canvas
			className={chronoGraphVariants({ class: props.class })}
			ref={(el) => {
				if (!el) return;

				canvasRef.current = el;
				observeResize(canvasRef.current, redraw);
			}}
		/>
	);
}

export type Sample = { value: bigint };

const chronoGraphVariants = tv({
	base: "size-full border-muted/60 bg-muted/30 text-accent-foreground",
});

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

function normalizeValues(
	samples: Sample[],
	min: bigint,
	max: bigint,
): number[] {
	return samples.map(({ value }) => {
		return tryOr(() => normalizeBigint(value, min, max), 0.5);
	});
}
