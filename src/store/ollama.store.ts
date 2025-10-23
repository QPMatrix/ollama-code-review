import { create } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import { ollamaAPI } from '@/api/ollama.api';
import type { AppConfig } from '@/schemas/schemas.types';
import type { OllamaState } from './types';

interface OllamaStoreDeps {
	getUserConfig: () => AppConfig | null;
	updateUserConfig: (config: AppConfig) => void;
}

export const createOllamaStore = (deps: OllamaStoreDeps) =>
	create<OllamaState>()((set, get) => ({
		ollamaModels: [],
		selectedModel: null,
		isOllamaConnected: false,
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

				const state = get();
				if (!state.selectedModel && models.length > 0) {
					await state.selectModel(models[0].name);
				}
			} catch (error) {
				console.error('Failed to fetch Ollama models:', error);
				set({ isOllamaConnected: false });
				throw error;
			}
		},
		selectModel: async (model) => {
			set({ selectedModel: model });

			const config = deps.getUserConfig();
			if (!config) {
				return;
			}

			const updatedConfig = { ...config, selectedModel: model };
			deps.updateUserConfig(updatedConfig);

			try {
				await databaseAPI.saveUserConfig(updatedConfig);
			} catch (error) {
				console.error('Failed to persist selected model:', error);
			}
		},
	}));
