import { createFileRoute } from "@tanstack/react-router";
import { Button } from "antd";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Button>test</Button>
		</div>
	);
}
