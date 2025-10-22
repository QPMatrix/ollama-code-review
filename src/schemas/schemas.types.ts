import { z } from "zod";
import { AppConfigSchema, UserSessionSchema } from "./app-state.schemas";
import { FrameworkTypeSchema, LanguageTypeSchema, ProjectTypeSchema, CodeStandardRuleSchema, CodeStandardSchema } from "./code-standard.schemas";
import { GitHubUserSchema, GitHubOrganizationSchema, GitHubRepositorySchema } from "./github.scheams";
import { OllamaModelSchema, OllamaModelsResponseSchema, OllamaGenerateRequestSchema, OllamaGenerateResponseSchema } from "./ollama.schemas";
import { ReviewIssueSchema, CodeReviewRequestSchema, CodeReviewResponseSchema } from "./review.scheams";

export type OllamaModel = z.infer<typeof OllamaModelSchema>;
export type OllamaModelsResponse = z.infer<typeof OllamaModelsResponseSchema>;
export type OllamaGenerateRequest = z.infer<typeof OllamaGenerateRequestSchema>;
export type OllamaGenerateResponse = z.infer<typeof OllamaGenerateResponseSchema>;

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