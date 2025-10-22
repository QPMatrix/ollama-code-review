import { z } from "zod";
import { SeveritySchema } from "./shared.scheams";

export const ReviewIssueSchema = z.object({
  id: z.string(),
  file: z.string(),
  line: z.number().optional(),
  severity: SeveritySchema,
  category: z.string(),
  message: z.string(),
  suggestion: z.string().optional(),
  ruleId: z.string().optional(),
});
const CodeReviewRequestFielsSchema=z.array(z.object({
    path: z.string(),
    content: z.string(),
  }))
export const CodeReviewRequestSchema = z.object({
  files: CodeReviewRequestFielsSchema,
  standardId: z.string(),
  model: z.string(),
});
const CodeReviewResponseSummarySchema =z.object({
    totalIssues: z.number(),
    errors: z.number(),
    warnings: z.number(),
    info: z.number(),
  })

export const CodeReviewResponseSchema = z.object({
  id: z.string(),
  standardId: z.string(),
  model: z.string(),
  issues: z.array(ReviewIssueSchema),
  summary: CodeReviewResponseSummarySchema,
  reviewedAt: z.string(),
  duration: z.number(), // milliseconds
});