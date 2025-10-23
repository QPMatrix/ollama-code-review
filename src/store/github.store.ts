import { create } from 'zustand';
import { githubAPI } from '@/api/github.api';
import type { GitHubState } from './types';

export const createGitHubStore = () =>
	create<GitHubState>()((set) => ({
		githubOrgs: [],
		githubRepos: [],
		clearGitHubData: () => {
			set({ githubOrgs: [], githubRepos: [] });
		},
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
	}));
