import { z } from 'zod';

export const OllamaModelDetailsSchema = z.object({
	parent_model: z.string().optional(),
	format: z.string().optional(),
	family: z.string().optional(),
	families: z.array(z.string()).optional(),
	parameter_size: z.string().optional(),
	quantization_level: z.string().optional(),
});

export const OllamaModelSchema = z.object({
	name: z.string(),
	model: z.string(),
	modified_at: z.string(),
	size: z.number(),
	digest: z.string(),
	details: OllamaModelDetailsSchema.optional(),
});

export const OllamaModelsResponseSchema = z.object({
	models: z.array(OllamaModelSchema),
});

export const OllamaMessageRoleSchema = z.enum(['system', 'user', 'assistant']);

export const OllamaMessageSchema = z.object({
	role: OllamaMessageRoleSchema,
	content: z.string(),
});

export const OllamaRequestOptionsSchema = z.object({
	temperature: z.number().optional(),
	top_p: z.number().optional(),
	top_k: z.number().optional(),
});

export const OllamaChatRequestSchema = z.object({
	model: z.string(),
	messages: z.array(OllamaMessageSchema).min(1),
	stream: z.boolean().default(true),
	options: OllamaRequestOptionsSchema.optional(),
});

export const OllamaChatResponseSchema = z.object({
	model: z.string(),
	created_at: z.string(),
	message: OllamaMessageSchema,
	done: z.boolean(),
	context: z.array(z.number()).optional(),
	total_duration: z.number().optional(),
	load_duration: z.number().optional(),
	prompt_eval_count: z.number().optional(),
	eval_count: z.number().optional(),
	eval_duration: z.number().optional(),
});

export const OllamaGenerateRequestSchema = z.object({
	model: z.string(),
	prompt: z.string(),
	stream: z.boolean().default(true),
	options: OllamaRequestOptionsSchema.optional(),
});

export const OllamaGenerateResponseSchema = z.object({
	model: z.string(),
	created_at: z.string(),
	response: z.string(),
	done: z.boolean(),
	context: z.array(z.number()).optional(),
	total_duration: z.number().optional(),
	load_duration: z.number().optional(),
	prompt_eval_count: z.number().optional(),
	eval_count: z.number().optional(),
	eval_duration: z.number().optional(),
});
