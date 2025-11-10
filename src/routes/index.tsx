import { createFileRoute } from "@tanstack/react-router";
import { Button, Layout } from "antd";
import {
	signIn,
	signOut,
	useSession,
} from "@/integrations/better-auth/auth-client";
export const Route = createFileRoute("/")({
	component: App,
});

const { Content } = Layout;
function App() {
	const { data: session } = useSession();
	const handleSignIn = () => {
		signIn.social({ provider: "github" });
	};
	const handleSingOut = () => signOut();
	return (
		<Content>
			{!session && <Button onClick={handleSignIn}>Sign in with Github</Button>}
			{session && <Button onClick={() => signOut()}>Sign out</Button>}
			{session && <p>Cliuent signed in as {session.user.name}</p>}
		</Content>
	);
}
