import { createHttpClient, type HttpClient } from '@/api/http-client';
import {
	type OllamaChatRequest,
	OllamaChatRequestSchema,
	OllamaChatResponseSchema,
	type OllamaModel,
	OllamaModelsResponseSchema,
} from '@/schemas';

export interface OllamaAPI {
	setBaseUrl(url: string): void;
	getModels(): Promise<OllamaModel[]>;
	ping(): Promise<boolean>;
	chat(request: OllamaChatRequest): Promise<string>;
	reviewCode(
		code: string,
		framework: string,
		language: string,
		model: string,
		rules?: string,
		bestPractices?: string,
	): Promise<string>;
	pullModel(modelName: string): Promise<void>;
	deleteModel(modelName: string): Promise<void>;
}

export const createOllamaAPI = (
	baseUrl: string = 'http://localhost:11434',
): OllamaAPI => {
	let currentBaseUrl = baseUrl;
	const httpClient: HttpClient = createHttpClient({
		baseUrl: currentBaseUrl,
		defaultHeaders: {
			'Content-Type': 'application/json',
		},
	});

	const buildReviewPrompt = (
		framework: string,
		language: string,
		rules?: string,
		bestPractices?: string,
	) => {
		const focusAreas = [
			'Code quality and maintainability',
			`Best practices for ${framework} and ${language}`,
			'Performance optimizations',
			'Security vulnerabilities',
			'Code style and consistency',
			'Potential bugs or issues',
			'Type safety (if applicable)',
		];

		const promptSections = [
			`You are an expert code reviewer specializing in ${language} and ${framework}. Your task is to review code and provide detailed, actionable feedback.`,
			`Focus on:\n- ${focusAreas.join('\n- ')}`,
		];

		if (rules) {
			promptSections.push(`Custom Rules to enforce:\n${rules}`);
		}

		if (bestPractices) {
			promptSections.push(`Project Best Practices:\n${bestPractices}`);
		}

		promptSections.push(
			'Provide your response in valid JSON format only. Do not include any text outside the JSON structure.',
		);

		return promptSections.join('\n\n');
	};

	const chat = async (request: OllamaChatRequest) => {
		try {
			const validatedRequest = OllamaChatRequestSchema.parse(request);
			const response = await httpClient.post('/api/chat', validatedRequest);
			const parsed = OllamaChatResponseSchema.parse(response);

			return parsed.message.content;
		} catch (error) {
			console.error('Error generating chat completion:', error);
			throw error;
		}
	};

	const reviewCode = async (
		code: string,
		framework: string,
		language: string,
		model: string,
		rules?: string,
		bestPractices?: string,
	) => {
		const systemPrompt = buildReviewPrompt(
			framework,
			language,
			rules,
			bestPractices,
		);

		const userPrompt = `Please review the following ${language} code for a ${framework} project:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide a detailed review in JSON format with the following structure:
{
  "summary": "Overall code quality summary",
  "issues": [
    {
      "line": line_number (optional),
      "severity": "error" | "warning" | "info",
      "message": "Description of the issue",
      "suggestion": "How to fix it",
      "category": "Category of issue (e.g., performance, security, style)"
    }
  ],
  "score": number between 0-100,
  "best_practices_followed": ["List of good practices found"],
  "improvements": ["List of suggested improvements"]
}`;

		return chat({
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt },
			],
			stream: false,
		});
	};

	return {
		setBaseUrl(url: string) {
			currentBaseUrl = url;
			httpClient.setBaseUrl(currentBaseUrl);
		},
		async getModels() {
			try {
				const data = await httpClient.get('/api/tags');
				const { models } = OllamaModelsResponseSchema.parse(data);

				return models;
			} catch (error) {
				console.error(`Error fetching Ollama models:`, error);
				throw error;
			}
		},
		async ping() {
			try {
				await httpClient.get('/api/tags', {
					timeout: 5_000,
				});

				return true;
			} catch {
				return false;
			}
		},
		chat,
		reviewCode,
		async pullModel(modelName: string) {
			try {
				await httpClient.post('/api/pull', { name: modelName });
			} catch (error) {
				console.error('Error pulling model:', error);
				throw error;
			}
		},
		async deleteModel(modelName: string) {
			try {
				await httpClient.delete('/api/delete', {
					body: { name: modelName },
				});
			} catch (error) {
				console.error('Error deleting model:', error);
				throw error;
			}
		},
	};
};

export const ollamaAPI = createOllamaAPI();
