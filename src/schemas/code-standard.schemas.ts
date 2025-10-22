import { z } from 'zod';

export const FrameworkTypeSchema = z.enum([
	'react',
	'angular',
	'vue',
	'svelte',
	'nextjs',
	'nuxt',
	'express',
	'fastify',
	'nestjs',
	'hono',
	'elysia',
	'other',
]);

export const LanguageTypeSchema = z.enum([
	'javascript',
	'typescript',
	'python',
	'java',
	'csharp',
	'go',
	'rust',
	'php',
	'ruby',
	'other',
]);

export const ProjectTypeSchema = z.enum(['frontend', 'backend', 'fullstack']);

const CodeStandardRuleCategorySchema = z.enum([
	'naming',
	'structure',
	'performance',
	'security',
	'accessibility',
	'best-practices',
	'documentation',
]);
const CodeStandardRuleSeveritySchema = z.enum(['error', 'warning', 'info']);
const CodeStandardRuleExamplesSchema = z
	.object({
		good: z.array(z.string()).optional(),
		bad: z.array(z.string()).optional(),
	})
	.optional();

export const CodeStandardRuleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	severity: CodeStandardRuleSeveritySchema,
	category: CodeStandardRuleCategorySchema,
	rule: z.string(), // Natural language rule
	examples: CodeStandardRuleExamplesSchema,
});

export const CodeStandardSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	projectType: ProjectTypeSchema,
	language: LanguageTypeSchema,
	framework: FrameworkTypeSchema.optional(),
	rules: z.array(CodeStandardRuleSchema),
	createdAt: z.string(),
	updatedAt: z.string(),
});
