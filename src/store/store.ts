import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
	createAppSlice,
	createCodeStandardsSlice,
	createGitHubSlice,
	createOllamaSlice,
	createReviewSlice,
	createUISlice,
	createUserSlice,
} from './slices';
import type { AppStore } from './types';

/**
 * Main application store combining all slices
 *
 * Architecture:
 * - Each domain has its own slice for separation of concerns
 * - Slices can access other slices through get() function
 * - All slices are combined into a single store for simplicity
 *
 * Slices:
 * - App: Application initialization and lifecycle
 * - User: User configuration and authentication
 * - GitHub: GitHub integration (repos, orgs)
 * - Ollama: Ollama AI model management
 * - CodeStandards: Code standards CRUD operations
 * - Review: Code review operations
 * - UI: UI state (sidebar, theme, etc.)
 */
export const useAppStore = create<AppStore>()(
	devtools(
		(...args) => ({
			...createAppSlice(...args),
			...createUserSlice(...args),
			...createGitHubSlice(...args),
			...createOllamaSlice(...args),
			...createCodeStandardsSlice(...args),
			...createReviewSlice(...args),
			...createUISlice(...args),
		}),
		{
			name: 'app-store',
			enabled: process.env.NODE_ENV === 'development',
		},
	),
);
