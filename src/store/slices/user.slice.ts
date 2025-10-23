import type { StateCreator } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { githubAPI } from '@/api/github.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { AppStore, UserSlice } from '../types';

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (
	set,
	get,
) => ({
	// State
	userConfig: null,
	githubUser: null,
	isGitHubAuthenticated: false,

	// Actions
	loadUserConfig: async () => {
		try {
			const config = await databaseAPI.getUserConfig();
			if (config) {
				set({ userConfig: config });

				// Configure APIs with loaded config
				if (config.ollamaUrl) {
					ollamaAPI.setBaseUrl(config.ollamaUrl);
				}

				if (config.githubToken) {
					githubAPI.setToken(config.githubToken);
					set({ isGitHubAuthenticated: true });

					// Fetch GitHub user info
					try {
						const user = await githubAPI.getCurrentUser();
						set({ githubUser: user });
					} catch (error) {
						console.error('Failed to fetch GitHub user:', error);
					}
				}

				if (config.selectedModel) {
					set({ selectedModel: config.selectedModel });
				}
			}
		} catch (error) {
			console.error('Failed to load user config:', error);
			throw error;
		}
	},

	setUserConfig: async (config) => {
		try {
			await databaseAPI.saveUserConfig(config);
			set({ userConfig: config });

			// Update Ollama URL if changed
			if (config.ollamaUrl) {
				ollamaAPI.setBaseUrl(config.ollamaUrl);
				await get().checkOllamaConnection();
			}

			// Update selected model if changed
			if (config.selectedModel) {
				set({ selectedModel: config.selectedModel });
			}
		} catch (error) {
			console.error('Failed to save user config:', error);
			throw error;
		}
	},

	loginWithGitHub: async (token) => {
		try {
			githubAPI.setToken(token);

			// Fetch user info
			const user = await githubAPI.getCurrentUser();
			set({ githubUser: user, isGitHubAuthenticated: true });

			// Fetch organizations
			await get().fetchGitHubOrgs();

			// Save token to config
			const currentConfig = get().userConfig || {
				ollamaUrl: 'http://localhost:11434',
				theme: 'system' as const,
			};

			await databaseAPI.saveUserConfig({
				...currentConfig,
				githubToken: token,
			});

			set({
				userConfig: {
					...currentConfig,
					githubToken: token,
				},
			});
		} catch (error) {
			console.error('Failed to login with GitHub:', error);
			throw error;
		}
	},

	logoutGitHub: async () => {
		githubAPI.clearToken();
		set({
			githubUser: null,
			githubOrgs: [],
			githubRepos: [],
			isGitHubAuthenticated: false,
		});

		// Update config to remove token
		const currentConfig = get().userConfig;
		if (currentConfig) {
			const { githubToken: _githubToken, ...rest } = currentConfig;
			try {
				await databaseAPI.saveUserConfig(rest);
				set({ userConfig: rest });
			} catch (error) {
				console.error('Failed to remove GitHub token from config:', error);
				// Config state already updated optimistically above
			}
		}
	},
});
