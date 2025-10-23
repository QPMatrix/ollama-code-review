import type { StateCreator } from 'zustand';
import { databaseAPI } from '@/api/database.api';
import type { AppStore, CodeStandardsSlice } from '../types';

export const createCodeStandardsSlice: StateCreator<
	AppStore,
	[],
	[],
	CodeStandardsSlice
> = (set, get) => ({
	// State
	codeStandards: [],
	selectedCodeStandard: null,

	// Actions
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

			// Clear selection if deleted standard was selected
			const state = get();
			const deletedStandardId = typeof id === 'number' ? id.toString() : id;
			if (state.selectedCodeStandard?.id === deletedStandardId) {
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
});
