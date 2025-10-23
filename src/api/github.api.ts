import {
	type GitHubOrganization,
	GitHubOrganizationSchema,
	type GitHubRepository,
	GitHubRepositorySchema,
	type GitHubUser,
	GitHubUserSchema,
} from '@/schemas';
import { createHttpClient, type HttpClient } from './http-client';

export interface GitHubAPI {
	setToken(token: string): void;
	clearToken(): void;
	getCurrentUser(): Promise<GitHubUser>;
	getUserOrganizations(): Promise<GitHubOrganization[]>;
	getUserRepositories(
		page?: number,
		perPage?: number,
	): Promise<GitHubRepository[]>;
	getOrganizationRepositories(
		org: string,
		page?: number,
		perPage?: number,
	): Promise<GitHubRepository[]>;
	getFileContent(owner: string, repo: string, path: string): Promise<string>;
	searchRepositories(
		query: string,
		page?: number,
		perPage?: number,
	): Promise<GitHubRepository[]>;
}

export const createGitHubAPI = (): GitHubAPI => {
	let token: string | undefined;
	const baseUrl = 'https://api.github.com';
	const httpClient: HttpClient = createHttpClient({ baseUrl });

	const getHeaders = () => {
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.v3+json',
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	};

	const ensureToken = () => {
		if (!token) {
			throw new Error('Github token not set');
		}
	};

	return {
		setToken(nextToken: string) {
			token = nextToken;
		},
		clearToken() {
			token = undefined;
		},
		async getCurrentUser() {
			ensureToken();

			try {
				const response = await httpClient.get('/user', {
					headers: getHeaders(),
				});

				return GitHubUserSchema.parse(response);
			} catch (error) {
				console.error('Error fetching GitHub user:', error);
				throw error;
			}
		},
		async getUserOrganizations() {
			ensureToken();

			try {
				const response = await httpClient.get('/user/orgs', {
					headers: getHeaders(),
				});

				return GitHubOrganizationSchema.array().parse(response);
			} catch (error) {
				console.error('Error fetching GitHub organizations:', error);
				throw error;
			}
		},
		async getUserRepositories(page = 1, perPage = 30) {
			ensureToken();

			try {
				const response = await httpClient.get(
					`/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
					{
						headers: getHeaders(),
					},
				);
				return GitHubRepositorySchema.array().parse(response);
			} catch (error) {
				console.error('Error fetching GitHub repositories:', error);
				throw error;
			}
		},
		async getOrganizationRepositories(org, page = 1, perPage = 30) {
			ensureToken();

			try {
				const response = await httpClient.get(
					`/orgs/${org}/repos?page=${page}&per_page=${perPage}&sort=updated`,
					{
						headers: getHeaders(),
					},
				);
				return GitHubRepositorySchema.array().parse(response);
			} catch (error) {
				console.error('Error fetching organization repositories:', error);
				throw error;
			}
		},
		async getFileContent(owner, repo, path) {
			ensureToken();

			try {
				const response = await httpClient.get<{
					content: string;
					encoding: string;
				}>(`/repos/${owner}/${repo}/contents/${path}`, {
					headers: getHeaders(),
				});
				return atob(response.content.replace(/\n/g, ''));
			} catch (error) {
				console.error('Error fetching file content:', error);
				throw error;
			}
		},
		async searchRepositories(query, page = 1, perPage = 30) {
			try {
				const response = await httpClient.get<{ items: GitHubRepository[] }>(
					`/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
					{
						headers: getHeaders(),
					},
				);
				return GitHubRepositorySchema.array().parse(response.items);
			} catch (error) {
				console.error('Error searching repositories:', error);
				throw error;
			}
		},
	};
};

export const githubAPI = createGitHubAPI();
