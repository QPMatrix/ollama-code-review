import type { z } from 'zod';
import type { AppConfigSchema, UserSessionSchema } from './app-state.schemas';
import type {
	CodeStandardRuleSchema,
	CodeStandardSchema,
	FrameworkTypeSchema,
	LanguageTypeSchema,
	ProjectTypeSchema,
} from './code-standard.schemas';
import type {
	GitHubOrganizationSchema,
	GitHubRepositorySchema,
	GitHubUserSchema,
} from './github.scheams';
import type {
	OllamaChatRequestSchema,
	OllamaChatResponseSchema,
	OllamaGenerateRequestSchema,
	OllamaGenerateResponseSchema,
	OllamaMessageSchema,
	OllamaModelSchema,
	OllamaModelsResponseSchema,
	OllamaRequestOptionsSchema,
} from './ollama.schemas';
import type {
	CodeReviewRequestSchema,
	CodeReviewResponseSchema,
	ReviewIssueSchema,
} from './review.scheams';

export type OllamaModel = z.infer<typeof OllamaModelSchema>;
export type OllamaModelsResponse = z.infer<typeof OllamaModelsResponseSchema>;
export type OllamaGenerateRequest = z.infer<typeof OllamaGenerateRequestSchema>;
export type OllamaGenerateResponse = z.infer<
	typeof OllamaGenerateResponseSchema
>;
export type OllamaChatRequest = z.infer<typeof OllamaChatRequestSchema>;
export type OllamaChatResponse = z.infer<typeof OllamaChatResponseSchema>;
export type OllamaMessage = z.infer<typeof OllamaMessageSchema>;
export type OllamaRequestOptions = z.infer<typeof OllamaRequestOptionsSchema>;

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
export type GitHubOrganization = z.infer<typeof GitHubOrganizationSchema>;
export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;

export type FrameworkType = z.infer<typeof FrameworkTypeSchema>;
export type LanguageType = z.infer<typeof LanguageTypeSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type CodeStandardRule = z.infer<typeof CodeStandardRuleSchema>;
export type CodeStandard = z.infer<typeof CodeStandardSchema>;

export type ReviewIssue = z.infer<typeof ReviewIssueSchema>;
export type CodeReviewRequest = z.infer<typeof CodeReviewRequestSchema>;
export type CodeReviewResponse = z.infer<typeof CodeReviewResponseSchema>;

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
