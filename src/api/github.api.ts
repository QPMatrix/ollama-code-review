import {
	type GitHubOrganization,
	GitHubOrganizationSchema,
	type GitHubRepository,
	GitHubRepositorySchema,
	type GitHubUser,
	GitHubUserSchema,
} from '@/schemas';
import { HttpClient } from './http-client';

export class GitHubAPI {
	private token?: string;
	private readonly baseUrl = 'https://api.github.com';
	private readonly httpClient: HttpClient;

	constructor() {
		this.httpClient = new HttpClient({ baseUrl: this.baseUrl });
	}

	setToken(token: string) {
		this.token = token;
	}

	clearToken() {
		this.token = undefined;
	}

	private getHeaders() {
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.v3+json',
		};

		if (this.token) {
			headers.Authorization = `Bearer ${this.token}`;
		}

		return headers;
	}

	async getCurrentUser(): Promise<GitHubUser> {
		if (!this.token) {
			throw new Error('Github token not set');
		}

		try {
			const response = await this.httpClient.get('/user', {
				headers: this.getHeaders(),
			});

			return GitHubUserSchema.parse(response);
		} catch (error) {
			console.error('Error fetching GitHub user:', error);
			throw error;
		}
	}

	async getUserOrganizations(): Promise<GitHubOrganization[]> {
		if (!this.token) {
			throw new Error('Github token not set');
		}

		try {
			const response = await this.httpClient.get('/user/orgs', {
				headers: this.getHeaders(),
			});

			return GitHubOrganizationSchema.array().parse(response);
		} catch (error) {
			console.error('Error fetching GitHub organizations:', error);
			throw error;
		}
	}

	async getUserRepositories(
		page: number = 1,
		perPage: number = 30,
	): Promise<GitHubRepository[]> {
		if (!this.token) {
			throw new Error('GitHub token not set');
		}
		try {
			const response = await this.httpClient.get(
				`/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
				{
					headers: this.getHeaders(),
				},
			);
			return GitHubRepositorySchema.array().parse(response);
		} catch (error) {
			console.error('Error fetching GitHub repositories:', error);
			throw error;
		}
	}

	async getOrganizationRepositories(
		org: string,
		page: number = 1,
		perPage: number = 30,
	): Promise<GitHubRepository[]> {
		if (!this.token) {
			throw new Error('GitHub token not set');
		}
		try {
			const response = await this.httpClient.get(
				`/orgs/${org}/repos?page=${page}&per_page=${perPage}&sort=updated`,
				{
					headers: this.getHeaders(),
				},
			);
			return GitHubRepositorySchema.array().parse(response);
		} catch (error) {
			console.error('Error fetching organization repositories:', error);
			throw error;
		}
	}
	async getFileContent(
		owner: string,
		repo: string,
		path: string,
	): Promise<string> {
		if (!this.token) {
			throw new Error('GitHub token not set');
		}
		try {
			const response = await this.httpClient.get<{
				content: string;
				encoding: string;
			}>(`/repos/${owner}/${repo}/contents/${path}`, {
				headers: this.getHeaders(),
			});
			const content = atob(response.content.replace(/\n/g, ''));
			return content;
		} catch (error) {
			console.error('Error fetching file content:', error);
			throw error;
		}
	}
	async searchRepositories(
		query: string,
		page: number = 1,
		perPage: number = 30,
	): Promise<GitHubRepository[]> {
		try {
			const response = await this.httpClient.get<{ items: GitHubRepository[] }>(
				`/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
				{
					headers: this.getHeaders(),
				},
			);
			return GitHubRepositorySchema.array().parse(response.items);
		} catch (error) {
			console.error('Error searching repositories:', error);
			throw error;
		}
	}
}
export const githubAPI = new GitHubAPI();
