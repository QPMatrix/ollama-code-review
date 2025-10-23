import type { StateCreator } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { AppStore, OllamaSlice } from '../types';

export const createOllamaSlice: StateCreator<AppStore, [], [], OllamaSlice> = (
	set,
	get,
) => ({
	// State
	ollamaModels: [],
	selectedModel: null,
	isOllamaConnected: false,

	// Actions
	checkOllamaConnection: async () => {
		try {
			const isConnected = await ollamaAPI.ping();
			set({ isOllamaConnected: isConnected });

			if (isConnected) {
				await get().fetchOllamaModels();
			}
		} catch (error) {
			console.error('Failed to check Ollama connection:', error);
			set({ isOllamaConnected: false });
		}
	},

	fetchOllamaModels: async () => {
		try {
			const models = await ollamaAPI.getModels();
			set({ ollamaModels: models, isOllamaConnected: true });

			// Auto-select first model if none selected
			const state = get();
			if (!state.selectedModel && models.length > 0) {
				get().selectModel(models[0].name);
			}
		} catch (error) {
			console.error('Failed to fetch Ollama models:', error);
			set({ isOllamaConnected: false });
			throw error;
		}
	},

	selectModel: (model) => {
		set({ selectedModel: model });

		// Update user config
		const config = get().userConfig;
		if (config) {
			databaseAPI.saveUserConfig({
				...config,
				selectedModel: model,
			});
		}
	},
});
