import type { StateCreator } from 'zustand';
import { githubAPI } from '@/api/github.api';
import type { AppStore, GitHubSlice } from '../types';

export const createGitHubSlice: StateCreator<AppStore, [], [], GitHubSlice> = (
	set,
) => ({
	// State
	githubOrgs: [],
	githubRepos: [],

	// Actions
	fetchGitHubOrgs: async () => {
		try {
			const orgs = await githubAPI.getUserOrganizations();
			set({ githubOrgs: orgs });
		} catch (error) {
			console.error('Failed to fetch GitHub organizations:', error);
			throw error;
		}
	},

	fetchGitHubRepos: async () => {
		try {
			const repos = await githubAPI.getUserRepositories();
			set({ githubRepos: repos });
		} catch (error) {
			console.error('Failed to fetch GitHub repos:', error);
			throw error;
		}
	},

	searchRepositories: async (query) => {
		try {
			const repos = await githubAPI.searchRepositories(query);
			set({ githubRepos: repos });
		} catch (error) {
			console.error('Failed to search repositories:', error);
			throw error;
		}
	},
});
