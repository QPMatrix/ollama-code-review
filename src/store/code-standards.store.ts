import { create } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import type { CodeStandardsState } from './types';

export const createCodeStandardsStore = () =>
	create<CodeStandardsState>()((set, get) => ({
		codeStandards: [],
		selectedCodeStandard: null,
		fetchCodeStandards: async () => {
			try {
				const standards = await databaseAPI.getCodeStandards();
				set({ codeStandards: standards });
			} catch (error) {
				console.error('Failed to fetch code standards:', error);
				throw error;
			}
		},
		saveCodeStandard: async (standard) => {
			try {
				await databaseAPI.saveCodeStandard(standard);
				await get().fetchCodeStandards();
			} catch (error) {
				console.error('Failed to save code standard:', error);
				throw error;
			}
		},
		updateCodeStandard: async (id, standard) => {
			try {
				await databaseAPI.updateCodeStandard(id, standard);
				await get().fetchCodeStandards();
			} catch (error) {
				console.error('Failed to update code standard:', error);
				throw error;
			}
		},
		deleteCodeStandard: async (id) => {
			try {
				await databaseAPI.deleteCodeStandard(id);
				await get().fetchCodeStandards();

				const current = get().selectedCodeStandard;
				const matches =
					current?.id === String(id) ||
					String(current?.id) === String(id) ||
					(typeof current?.id === 'string' &&
						Number.parseInt(current.id, 10) === id);

				if (matches) {
					set({ selectedCodeStandard: null });
				}
			} catch (error) {
				console.error('Failed to delete code standard:', error);
				throw error;
			}
		},
		selectCodeStandard: (standard) => {
			set({ selectedCodeStandard: standard });
		},
	}));
