import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./auth-client";

export const authMiddleware = createMiddleware().server(
	async ({ request, next }) => {
		const { data: session } = await getSession({
			fetchOptions: {
				headers: request.headers as HeadersInit,
			},
		});

		return await next({
			context: {
				user: {
					...session?.user,
				},
			},
		});
	},
);
