import { createAppStore } from './app.store';
import { createCodeStandardsStore } from './code-standards.store';
import { createGitHubStore } from './github.store';
import { createOllamaStore } from './ollama.store';
import { createReviewStore } from './review.store';
import { createUIStore } from './ui.store';
import { createUserStore } from './user.store';

export const useGitHubStore = createGitHubStore();
export const useCodeStandardsStore = createCodeStandardsStore();
export const useUIStore = createUIStore();

let userStore: ReturnType<typeof createUserStore>;

export const useOllamaStore = createOllamaStore({
	getUserConfig: () => userStore.getState().userConfig,
	updateUserConfig: (config) => userStore.setState({ userConfig: config }),
});

userStore = createUserStore({
	setSelectedModel: (model) =>
		useOllamaStore.setState({ selectedModel: model }),
	checkOllamaConnection: () =>
		useOllamaStore.getState().checkOllamaConnection(),
	fetchGitHubOrgs: () => useGitHubStore.getState().fetchGitHubOrgs(),
	clearGitHubData: () => useGitHubStore.getState().clearGitHubData(),
});

export const useUserStore = userStore;

export const useReviewStore = createReviewStore({
	getSelectedModel: () => useOllamaStore.getState().selectedModel,
	isOllamaConnected: () => useOllamaStore.getState().isOllamaConnected,
	getSelectedCodeStandard: () =>
		useCodeStandardsStore.getState().selectedCodeStandard,
});

export const useAppStore = createAppStore({
	loadUserConfig: () => useUserStore.getState().loadUserConfig(),
	fetchCodeStandards: () =>
		useCodeStandardsStore.getState().fetchCodeStandards(),
	checkOllamaConnection: () =>
		useOllamaStore.getState().checkOllamaConnection(),
	isGitHubAuthenticated: () => useUserStore.getState().isGitHubAuthenticated,
	fetchGitHubOrgs: () => useGitHubStore.getState().fetchGitHubOrgs(),
});
