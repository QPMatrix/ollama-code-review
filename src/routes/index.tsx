import { createFileRoute } from "@tanstack/react-router";
import { Button, Layout } from "antd";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { Content } = Layout;
	return (
		<Content>
			<Button>test</Button>
		</Content>
	);
}
