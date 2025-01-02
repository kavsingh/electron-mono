import { createMutation } from "@tanstack/solid-query";
import { createMemo, Show } from "solid-js";

import CustomError from "#common/errors/custom-error";
import Button from "#renderer/components/button";
import Card from "#renderer/components/card";
import { ipc } from "#renderer/ipc";

export default function SerializerCheck() {
	const customErrorMutation = createMutation(() => ({
		mutationFn: () => ipc.throwCustomError.mutate(),
	}));

	const customErrorMessage = createMemo(() => {
		if (!customErrorMutation.error) return undefined;

		return customErrorMutation.error instanceof CustomError
			? `${customErrorMutation.error.code}: ${customErrorMutation.error.message}`
			: "unknown error";
	});

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Serializer Check</Card.Title>
			</Card.Header>
			<Card.Content>
				<Button
					onClick={() => {
						customErrorMutation.mutate();
					}}
				>
					Throw custom error
				</Button>
				<Show when={customErrorMessage()} keyed>
					{(message) => {
						return (
							<div class="rounded-sm bg-red-600 p-4 text-white">{message}</div>
						);
					}}
				</Show>
			</Card.Content>
		</Card.Root>
	);
}
