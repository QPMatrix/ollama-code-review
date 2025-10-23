import { create } from 'zustand';
import { initDatabase } from '@/api/database.api';
import type { AppState } from './types';

interface AppStoreDeps {
	loadUserConfig: () => Promise<void>;
	fetchCodeStandards: () => Promise<void>;
	checkOllamaConnection: () => Promise<void>;
	isGitHubAuthenticated: () => boolean;
	fetchGitHubOrgs: () => Promise<void>;
}

export const createAppStore = (deps: AppStoreDeps) =>
	create<AppState>()((set, get) => ({
		isInitialized: false,
		isInitializing: false,
		initializationError: null,
		initializeApp: async () => {
			if (get().isInitializing || get().isInitialized) {
				return;
			}

			set({ isInitializing: true, initializationError: null });

			try {
				await initDatabase();
				await deps.loadUserConfig();
				await deps.fetchCodeStandards();
				await deps.checkOllamaConnection();

				if (deps.isGitHubAuthenticated()) {
					try {
						await deps.fetchGitHubOrgs();
					} catch (error) {
						console.error('Failed to fetch GitHub data:', error);
					}
				}

				set({ isInitialized: true, isInitializing: false });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'Unknown error occurred';
				console.error('Failed to initialize app:', error);
				set({
					isInitializing: false,
					initializationError: message,
				});
			}
		},
	}));
