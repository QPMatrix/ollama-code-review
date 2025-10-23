import { create } from 'zustand';
import type { UIState } from './types';

export const createUIStore = () =>
	create<UIState>()((set) => ({
		sidebarOpen: true,
		theme: 'system',
		currentPage: 'dashboard',
		setSidebarOpen: (open) => {
			set({ sidebarOpen: open });
		},
		setTheme: (theme) => {
			set({ theme });
		},
		setCurrentPage: (page) => {
			set({ currentPage: page });
		},
	}));
