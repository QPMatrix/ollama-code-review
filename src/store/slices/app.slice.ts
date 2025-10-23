import type { StateCreator } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import type { AppSlice, AppStore } from '../types';

export const createAppSlice: StateCreator<AppStore, [], [], AppSlice> = (
	set,
	get,
) => ({
	// State
	isInitialized: false,
	isInitializing: false,
	initializationError: null,

	// Actions
	initializeApp: async () => {
		if (get().isInitializing || get().isInitialized) {
			return;
		}

		set({ isInitializing: true, initializationError: null });

		try {
			// Initialize database
			await databaseAPI.initDatabase();

			// Load user config (this will also configure APIs)
			await get().loadUserConfig();

			// Load code standards
			await get().fetchCodeStandards();

			// Check Ollama connection
			await get().checkOllamaConnection();

			// Fetch GitHub organizations if authenticated
			if (get().isGitHubAuthenticated) {
				try {
					await get().fetchGitHubOrgs();
				} catch (error) {
					console.error('Failed to fetch GitHub data:', error);
				}
			}

			set({ isInitialized: true, isInitializing: false });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('Failed to initialize app:', error);
			set({
				isInitializing: false,
				initializationError: errorMessage,
			});
			throw error;
		}
	},
});
