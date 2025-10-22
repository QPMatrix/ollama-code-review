import z from 'zod';

const OlamaModelDetailsSchema = z
	.object({
		parent_model: z.string().optional(),
		format: z.string().optional(),
		family: z.string().optional(),
		families: z.array(z.string()).optional(),
		parameter_size: z.string().optional(),
		quantization_level: z.string().optional(),
	})
	.optional();

export const OllamaModelSchema = z.object({
	name: z.string(),
	model: z.string(),
	modified_at: z.string(),
	size: z.number(),
	digest: z.string(),
	details: OlamaModelDetailsSchema,
});

export const OllamaModelsResponseSchema = z.object({
	models: z.array(OllamaModelSchema),
});

const OllamaGenerateRequestSchemaOptions = z
	.object({
		temperature: z.number().optional(),
		top_p: z.number().optional(),
		top_k: z.number().optional(),
	})
	.optional();

export const OllamaGenerateRequestSchema = z.object({
	models: z.string(),
	propmt: z.string(),
	stream: z.boolean().optional().default(true),
	options: OllamaGenerateRequestSchemaOptions,
});
