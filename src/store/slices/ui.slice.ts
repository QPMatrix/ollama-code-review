import type { StateCreator } from 'zustand';
import type { AppStore, UISlice } from '../types';

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (
	set,
) => ({
	// State
	sidebarOpen: true,
	theme: 'system',

	// Actions
	setSidebarOpen: (open) => {
		set({ sidebarOpen: open });
	},

	setTheme: (theme) => {
		set({ theme });

		// Update user config
		// Note: This would require access to userConfig,
		// which is handled by the user slice
	},
});
