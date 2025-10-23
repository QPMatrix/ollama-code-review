import { create } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { githubAPI } from '@/api/github.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { UserState } from './types';

interface UserStoreDeps {
	setSelectedModel: (model: string | null) => void;
	checkOllamaConnection: () => Promise<void>;
	fetchGitHubOrgs: () => Promise<void>;
	clearGitHubData: () => void;
}

export const createUserStore = (deps: UserStoreDeps) =>
	create<UserState>()((set, get) => ({
		userConfig: null,
		githubUser: null,
		isGitHubAuthenticated: false,
		loadUserConfig: async () => {
			try {
				const config = await databaseAPI.getUserConfig();
				if (!config) {
					return;
				}

				set({ userConfig: config });

				if (config.ollamaUrl) {
					ollamaAPI.setBaseUrl(config.ollamaUrl);
				}

				if (config.selectedModel) {
					deps.setSelectedModel(config.selectedModel);
				}

				if (config.githubToken) {
					githubAPI.setToken(config.githubToken);
					set({ isGitHubAuthenticated: true });

					try {
						const user = await githubAPI.getCurrentUser();
						set({ githubUser: user });
					} catch (error) {
						console.error('Failed to fetch GitHub user:', error);
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

				if (config.ollamaUrl) {
					ollamaAPI.setBaseUrl(config.ollamaUrl);
					await deps.checkOllamaConnection();
				}

				deps.setSelectedModel(config.selectedModel ?? null);
			} catch (error) {
				console.error('Failed to save user config:', error);
				throw error;
			}
		},
		loginWithGitHub: async (token) => {
			try {
				githubAPI.setToken(token);

				const user = await githubAPI.getCurrentUser();
				set({ githubUser: user, isGitHubAuthenticated: true });

				await deps.fetchGitHubOrgs();

				const currentConfig = get().userConfig || {
					ollamaUrl: 'http://localhost:11434',
					theme: 'system' as const,
				};

				const updatedConfig = {
					...currentConfig,
					githubToken: token,
				};

				await databaseAPI.saveUserConfig(updatedConfig);
				set({ userConfig: updatedConfig });
			} catch (error) {
				console.error('Failed to login with GitHub:', error);
				throw error;
			}
		},
		logoutGitHub: async () => {
			githubAPI.clearToken();
			set({
				githubUser: null,
				isGitHubAuthenticated: false,
			});
			deps.clearGitHubData();

			const currentConfig = get().userConfig;
			if (currentConfig) {
				const { githubToken: _githubToken, ...rest } = currentConfig;
				try {
					await databaseAPI.saveUserConfig(rest);
					set({ userConfig: rest });
				} catch (error) {
					console.error('Failed to remove GitHub token from config:', error);
				}
			}
		},
	}));
