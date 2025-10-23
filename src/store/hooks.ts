import { useAppStore } from './store';

/**
 * Custom hooks for accessing specific parts of the store
 * These hooks provide better developer experience and type safety
 */

// ============================================================================
// App Hooks
// ============================================================================

export const useAppInitialization = () =>
	useAppStore((state) => ({
		isInitialized: state.isInitialized,
		isInitializing: state.isInitializing,
		initializationError: state.initializationError,
		initializeApp: state.initializeApp,
	}));

// ============================================================================
// User & Auth Hooks
// ============================================================================

export const useUserConfig = () =>
	useAppStore((state) => ({
		config: state.userConfig,
		setUserConfig: state.setUserConfig,
		loadUserConfig: state.loadUserConfig,
	}));

export const useGitHubAuth = () =>
	useAppStore((state) => ({
		user: state.githubUser,
		isAuthenticated: state.isGitHubAuthenticated,
		loginWithGitHub: state.loginWithGitHub,
		logoutGitHub: state.logoutGitHub,
	}));

// ============================================================================
// GitHub Hooks
// ============================================================================

export const useGitHubOrganizations = () =>
	useAppStore((state) => ({
		organizations: state.githubOrgs,
		fetchGitHubOrgs: state.fetchGitHubOrgs,
	}));

export const useGitHubRepositories = () =>
	useAppStore((state) => ({
		repositories: state.githubRepos,
		fetchGitHubRepos: state.fetchGitHubRepos,
		searchRepositories: state.searchRepositories,
	}));

// ============================================================================
// Ollama Hooks
// ============================================================================

export const useOllamaModels = () =>
	useAppStore((state) => ({
		models: state.ollamaModels,
		selectedModel: state.selectedModel,
		isConnected: state.isOllamaConnected,
		fetchOllamaModels: state.fetchOllamaModels,
		selectModel: state.selectModel,
		checkConnection: state.checkOllamaConnection,
	}));

// ============================================================================
// Code Standards Hooks
// ============================================================================

export const useCodeStandards = () =>
	useAppStore((state) => ({
		standards: state.codeStandards,
		selectedStandard: state.selectedCodeStandard,
		fetchCodeStandards: state.fetchCodeStandards,
		saveCodeStandard: state.saveCodeStandard,
		updateCodeStandard: state.updateCodeStandard,
		deleteCodeStandard: state.deleteCodeStandard,
		selectCodeStandard: state.selectCodeStandard,
	}));

// ============================================================================
// Review Hooks
// ============================================================================

export const useCodeReview = () =>
	useAppStore((state) => ({
		currentReview: state.currentReview,
		isReviewing: state.isReviewing,
		reviewHistory: state.reviewHistory,
		reviewCode: state.reviewCode,
		fetchReviewHistory: state.fetchReviewHistory,
		clearCurrentReview: state.clearCurrentReview,
	}));

// ============================================================================
// UI Hooks
// ============================================================================

export const useSidebar = () =>
	useAppStore((state) => ({
		isOpen: state.sidebarOpen,
		setSidebarOpen: state.setSidebarOpen,
	}));

export const useTheme = () =>
	useAppStore((state) => ({
		theme: state.theme,
		setTheme: state.setTheme,
	}));

// ============================================================================
// Selector Hooks (for when you need just a value)
// ============================================================================

export const useIsGitHubAuthenticated = () =>
	useAppStore((state) => state.isGitHubAuthenticated);

export const useSelectedModel = () =>
	useAppStore((state) => state.selectedModel);

export const useSelectedCodeStandard = () =>
	useAppStore((state) => state.selectedCodeStandard);

export const useIsOllamaConnected = () =>
	useAppStore((state) => state.isOllamaConnected);

export const useCurrentReview = () =>
	useAppStore((state) => state.currentReview);

export const useIsReviewing = () => useAppStore((state) => state.isReviewing);

export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
