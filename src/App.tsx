import { Menu } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { CodeReviewPage } from './pages/CodeReviewPage';
import { CodeStandardsPage } from './pages/CodeStandardsPage';
import { DashboardPage } from './pages/DashboardPage';
import GitHubPage from './pages/GitHubPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAppInitialization, usePage, useSidebar } from './store';

export const App = () => {
	const { initializeApp, isInitializing, isInitialized, initializationError } =
		useAppInitialization();
	const { currentPage } = usePage();

	const hasAttemptedInit = useRef(false);

	useEffect(() => {
		if (
			!hasAttemptedInit.current &&
			!isInitialized &&
			!isInitializing &&
			!initializationError
		) {
			hasAttemptedInit.current = true;
			void initializeApp();
		}
	}, [initializeApp, initializationError, isInitialized, isInitializing]);

	const renderPage = () => {
		switch (currentPage) {
			case 'dashboard':
				return <DashboardPage />;
			case 'review':
				return <CodeReviewPage />;
			case 'standards':
				return <CodeStandardsPage />;
			case 'github':
				return <GitHubPage />;
			case 'settings':
				return <SettingsPage />;
			default:
				return <DashboardPage />;
		}
	};
	return (
		<main className="flex min-h-screen">
			<Sidebar />
			<section className="main-content">{renderPage()}</section>
		</main>
	);
};
