import { z } from "zod";
import { GitHubOrganizationSchema, GitHubUserSchema } from "./github.scheams";
const ThemeSchema = z.enum(['light', 'dark', 'system']).default('system')

export const AppConfigSchema = z.object({
  ollamaUrl: z.url().default('http://localhost:11434'),
  githubToken: z.string().optional(),
  selectedModel: z.string().optional(),
  theme: ThemeSchema,
});

export const UserSessionSchema = z.object({
  user: GitHubUserSchema.optional(),
  organizations: z.array(GitHubOrganizationSchema).optional(),
  isAuthenticated: z.boolean(),
  token: z.string().optional(),
});
