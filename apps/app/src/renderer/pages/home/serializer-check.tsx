import { useMutation } from "@tanstack/solid-query";
import { createMemo, Show } from "solid-js";

import CustomError from "#common/errors/custom-error";
import Button from "#renderer/components/button";
import Card from "#renderer/components/card";
import { ipc } from "#renderer/ipc";

export default function SerializerCheck() {
	const mutation = useMutation(() => ({
		mutationFn: ipc.throwCustomError.mutate,
	}));

	const errorMessage = createMemo(() => {
		if (!mutation.error) return undefined;

		return mutation.error instanceof CustomError
			? `${mutation.error.code}: ${mutation.error.message}`
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
						mutation.mutate();
					}}
				>
					Throw custom error
				</Button>
				<Show when={errorMessage()} keyed>
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
