import { z } from 'zod';

export const GitHubUserSchema = z.object({
	login: z.string(),
	id: z.number(),
	avatar_url: z.string(),
	name: z.string().nullable(),
	email: z.string().nullable(),
	bio: z.string().nullable(),
	public_repos: z.number(),
	followers: z.number(),
	following: z.number(),
});

export const GitHubOrganizationSchema = z.object({
	login: z.string(),
	id: z.number(),
	avatar_url: z.string(),
	description: z.string().nullable(),
});

const GitHubRepositoryOwnerSchema = z.object({
	login: z.string(),
	avatar_url: z.string(),
});

export const GitHubRepositorySchema = z.object({
	id: z.number(),
	name: z.string(),
	full_name: z.string(),
	private: z.boolean(),
	owner: GitHubRepositoryOwnerSchema,
	description: z.string().nullable(),
	fork: z.boolean(),
	language: z.string().nullable(),
	default_branch: z.string(),
});
