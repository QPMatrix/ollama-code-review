import { useShallow } from 'zustand/shallow';
import {
	useAppStore,
	useCodeStandardsStore,
	useGitHubStore,
	useOllamaStore,
	useReviewStore,
	useUIStore,
	useUserStore,
} from './root';

/**
 * Custom hooks for accessing specific parts of the store
 * These hooks provide better developer experience and type safety
 */

// ============================================================================
// App Hooks
// ============================================================================

export const useAppInitialization = () =>
	useAppStore(
		useShallow((state) => ({
			isInitialized: state.isInitialized,
			isInitializing: state.isInitializing,
			initializationError: state.initializationError,
			initializeApp: state.initializeApp,
		})),
	);

// ============================================================================
// User & Auth Hooks
// ============================================================================

export const useUserConfig = () =>
	useUserStore(
		useShallow((state) => ({
			config: state.userConfig,
			setUserConfig: state.setUserConfig,
			loadUserConfig: state.loadUserConfig,
		})),
	);

export const useGitHubAuth = () =>
	useUserStore(
		useShallow((state) => ({
			user: state.githubUser,
			isAuthenticated: state.isGitHubAuthenticated,
			loginWithGitHub: state.loginWithGitHub,
			logoutGitHub: state.logoutGitHub,
		})),
	);

// ============================================================================
// GitHub Hooks
// ============================================================================

export const useGitHubOrganizations = () =>
	useGitHubStore(
		useShallow((state) => ({
			organizations: state.githubOrgs,
			fetchGitHubOrgs: state.fetchGitHubOrgs,
		})),
	);

export const useGitHubRepositories = () =>
	useGitHubStore(
		useShallow((state) => ({
			repositories: state.githubRepos,
			fetchGitHubRepos: state.fetchGitHubRepos,
			searchRepositories: state.searchRepositories,
		})),
	);

// ============================================================================
// Ollama Hooks
// ============================================================================

export const useOllamaModels = () =>
	useOllamaStore(
		useShallow((state) => ({
			models: state.ollamaModels,
			selectedModel: state.selectedModel,
			isConnected: state.isOllamaConnected,
			fetchOllamaModels: state.fetchOllamaModels,
			selectModel: state.selectModel,
			checkConnection: state.checkOllamaConnection,
		})),
	);

// ============================================================================
// Code Standards Hooks
// ============================================================================

export const useCodeStandards = () =>
	useCodeStandardsStore(
		useShallow((state) => ({
			standards: state.codeStandards,
			selectedStandard: state.selectedCodeStandard,
			fetchCodeStandards: state.fetchCodeStandards,
			saveCodeStandard: state.saveCodeStandard,
			updateCodeStandard: state.updateCodeStandard,
			deleteCodeStandard: state.deleteCodeStandard,
			selectCodeStandard: state.selectCodeStandard,
		})),
	);

// ============================================================================
// Review Hooks
// ============================================================================

export const useCodeReview = () =>
	useReviewStore(
		useShallow((state) => ({
			currentReview: state.currentReview,
			isReviewing: state.isReviewing,
			reviewHistory: state.reviewHistory,
			reviewCode: state.reviewCode,
			fetchReviewHistory: state.fetchReviewHistory,
			clearCurrentReview: state.clearCurrentReview,
		})),
	);

// ============================================================================
// UI Hooks
// ============================================================================

export const useSidebar = () =>
	useUIStore(
		useShallow((state) => ({
			isOpen: state.sidebarOpen,
			setSidebarOpen: state.setSidebarOpen,
		})),
	);

export const useTheme = () =>
	useUIStore(
		useShallow((state) => ({
			theme: state.theme,
			setTheme: state.setTheme,
		})),
	);
export const usePage = () =>
	useUIStore(
		useShallow((state) => ({
			currentPage: state.currentPage,
			setCurrentPage: state.setCurrentPage,
		})),
	);
// ============================================================================
// Selector Hooks (for when you need just a value)
// ============================================================================

export const useIsGitHubAuthenticated = () =>
	useUserStore((state) => state.isGitHubAuthenticated);

export const useSelectedModel = () =>
	useOllamaStore((state) => state.selectedModel);

export const useSelectedCodeStandard = () =>
	useCodeStandardsStore((state) => state.selectedCodeStandard);

export const useIsOllamaConnected = () =>
	useOllamaStore((state) => state.isOllamaConnected);

export const useCurrentReview = () =>
	useReviewStore((state) => state.currentReview);

export const useIsReviewing = () =>
	useReviewStore((state) => state.isReviewing);

export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
