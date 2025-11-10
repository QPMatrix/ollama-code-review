import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserID } from "@/integrations/better-auth/auth-server-func";

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: async () => {
		const userID = await getUserID();
		return {
			userID,
		};
	},
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.userID) {
			throw redirect({ to: "/" });
		}
		return {
			userID: context.userID,
		};
	},
});

function RouteComponent() {
	const { userID } = Route.useLoaderData();
	return (
		<div>
			<h1>dashboard</h1>
			<p>User ID: {userID}</p>
		</div>
	);
}
