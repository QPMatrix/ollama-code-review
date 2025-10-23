import type { StateCreator } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { CodeReviewResponse } from '@/schemas/schemas.types';
import type { AppStore, ReviewSlice } from '../types';

export const createReviewSlice: StateCreator<AppStore, [], [], ReviewSlice> = (
	set,
	get,
) => ({
	// State
	currentReview: null,
	isReviewing: false,
	reviewHistory: [],

	// Actions
	reviewCode: async (code, framework, language, filePath) => {
		const state = get();

		if (!state.selectedModel) {
			throw new Error('No model selected');
		}

		if (!state.isOllamaConnected) {
			throw new Error('Ollama is not connected');
		}

		set({ isReviewing: true });

		try {
			const standard = state.selectedCodeStandard;

			// Convert structured rules to string format for Ollama
			const rulesText = standard?.rules
				? standard.rules
						.map(
							(rule) =>
								`- [${rule.severity.toUpperCase()}] ${rule.name}: ${rule.description}\n  Rule: ${rule.rule}`,
						)
						.join('\n')
				: undefined;

			const bestPracticesText = standard?.description;

			// Call Ollama API
			const response = await ollamaAPI.reviewCode(
				code,
				framework,
				language,
				state.selectedModel,
				rulesText,
				bestPracticesText,
			);

			// Parse JSON response
			let reviewResult: CodeReviewResponse;
			try {
				// Extract JSON from response (in case there's extra text)
				const jsonMatch = response.match(/\{[\s\S]*\}/);
				if (jsonMatch) {
					reviewResult = JSON.parse(jsonMatch[0]) as CodeReviewResponse;
				} else {
					throw new Error('No JSON found in response');
				}
			} catch (parseError) {
				console.error('Failed to parse review response:', parseError);
				throw new Error('Failed to parse review response');
			}

			set({ currentReview: reviewResult });

			// Save to history
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
});
