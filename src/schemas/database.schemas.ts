import { z } from 'zod';
import {
	FrameworkTypeSchema,
	LanguageTypeSchema,
} from './code-standard.schemas';

/**
 * Database schema for CodeStandard
 * This matches the Rust backend structure which stores in SQLite
 * Note: This is different from the rich CodeStandardSchema used in the UI
 */
export const DbCodeStandardSchema = z.object({
	id: z.number().optional(), // SQLite auto-increment
	name: z.string(),
	framework: FrameworkTypeSchema,
	language: LanguageTypeSchema,
	rules: z.string(), // Stored as JSON string in database
	best_practices: z.string(), // Stored as string in database
	created_at: z.string().optional(),
});

export type DbCodeStandard = z.infer<typeof DbCodeStandardSchema>;
