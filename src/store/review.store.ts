import { create } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { CodeStandard } from '@/schemas/schemas.types';
import type { ReviewState } from './types';

interface ReviewStoreDeps {
	getSelectedModel: () => string | null;
	isOllamaConnected: () => boolean;
	getSelectedCodeStandard: () => CodeStandard | null;
}

export const createReviewStore = (deps: ReviewStoreDeps) =>
	create<ReviewState>()((set) => ({
		currentReview: null,
		isReviewing: false,
		reviewHistory: [],
		reviewCode: async (code, framework, language, filePath) => {
			const selectedModel = deps.getSelectedModel();
			if (!selectedModel) {
				throw new Error('No model selected');
			}

			if (!deps.isOllamaConnected()) {
				throw new Error('Ollama is not connected');
			}

			set({ isReviewing: true });

			try {
				const standard = deps.getSelectedCodeStandard();
				const rulesText = standard?.rules
					? standard.rules
							.map(
								(rule) =>
									`- [${rule.severity.toUpperCase()}] ${rule.name}: ${rule.description}\n  Rule: ${rule.rule}`,
							)
							.join('\n')
					: undefined;

				const bestPracticesText = standard?.description;
				const response = await ollamaAPI.reviewCode(
					code,
					framework,
					language,
					selectedModel,
					rulesText,
					bestPracticesText,
				);

				const jsonMatch = response.match(/\{[\s\S]*\}/);
				if (!jsonMatch) {
					throw new Error('No JSON found in response');
				}

				const reviewResult = JSON.parse(jsonMatch[0]);
				set({ currentReview: reviewResult });

				await databaseAPI.saveReviewHistory(
					filePath || 'unnamed',
					framework,
					language,
					JSON.stringify(reviewResult),
					reviewResult.issues?.length || 0,
				);

				return reviewResult;
			} catch (error) {
				console.error('Failed to review code:', error);
				throw error;
			} finally {
				set({ isReviewing: false });
			}
		},
		fetchReviewHistory: async (limit = 50) => {
			try {
				const history = await databaseAPI.getReviewHistory(limit);
				set({ reviewHistory: history });
			} catch (error) {
				console.error('Failed to fetch review history:', error);
				throw error;
			}
		},
		clearCurrentReview: () => {
			set({ currentReview: null });
		},
	}));
