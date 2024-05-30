import { useMutation, useQuery } from "@tanstack/react-query";

import { THEME_SOURCES, themeSourceSchema } from "#common/lib/theme";
import Card from "#renderer/components/card";
import { trpc } from "#renderer/trpc";

import type { ThemeSource } from "#common/lib/theme";
import type { ChangeEventHandler, FormEventHandler } from "react";

export default function ThemeSwitch() {
	const { data: themeSource, refetch } = useQuery({
		queryKey: ["ThemeSource"],
		queryFn: () => trpc.themeSource.query(),
	});
	const { mutate: saveThemeSource } = useMutation({
		mutationFn: (source: ThemeSource) => trpc.setThemeSource.mutate(source),
		onSuccess: () => void refetch(),
	});

	const handleSubmit: FormEventHandler = (event) => {
		event.preventDefault();
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		saveThemeSource(themeSourceSchema.parse(event.currentTarget.value));
	};

	return (
		<Card.Root>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<Card.Header>
						<Card.Title>
							<legend>Theme</legend>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul className="flex gap-3">
							{THEME_SOURCES.map((option) => (
								<li className="flex items-center gap-1" key={option}>
									<input
										type="radio"
										id={option}
										name={option}
										value={option}
										checked={themeSource === option}
										onChange={handleChange}
										className="peer size-4 cursor-pointer"
									/>
									<label
										className="cursor-pointer text-muted-foreground transition-colors peer-checked:text-foreground"
										htmlFor={option}
									>
										<LabelText themeSource={option} />
									</label>
								</li>
							))}
						</ul>
					</Card.Content>
				</fieldset>
			</form>
		</Card.Root>
	);
}

function LabelText(props: { themeSource: ThemeSource }) {
	switch (props.themeSource) {
		case "system":
			return <>System</>;

		case "light":
			return <>Light</>;

		case "dark":
			return <>Dark</>;

		default:
			return <>{props.themeSource}</>;
	}
}
