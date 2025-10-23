import type {
	AppConfig,
	CodeReviewResponse,
	CodeStandard,
	GitHubOrganization,
	GitHubRepository,
	GitHubUser,
	OllamaModel,
} from '@/schemas/schemas.types';

// User & Authentication Slice
export interface UserSlice {
	userConfig: AppConfig | null;
	githubUser: GitHubUser | null;
	isGitHubAuthenticated: boolean;

	setUserConfig: (config: AppConfig) => Promise<void>;
	loginWithGitHub: (token: string) => Promise<void>;
	logoutGitHub: () => Promise<void>;
	loadUserConfig: () => Promise<void>;
}

// GitHub Slice
export interface GitHubSlice {
	githubOrgs: GitHubOrganization[];
	githubRepos: GitHubRepository[];

	fetchGitHubOrgs: () => Promise<void>;
	fetchGitHubRepos: () => Promise<void>;
	searchRepositories: (query: string) => Promise<void>;
}

// Ollama Slice
export interface OllamaSlice {
	ollamaModels: OllamaModel[];
	selectedModel: string | null;
	isOllamaConnected: boolean;

	fetchOllamaModels: () => Promise<void>;
	selectModel: (model: string) => Promise<void>;
	checkOllamaConnection: () => Promise<void>;
}

// Code Standards Slice
export interface CodeStandardsSlice {
	codeStandards: CodeStandard[];
	selectedCodeStandard: CodeStandard | null;

	fetchCodeStandards: () => Promise<void>;
	saveCodeStandard: (standard: CodeStandard) => Promise<void>;
	updateCodeStandard: (id: number, standard: CodeStandard) => Promise<void>;
	deleteCodeStandard: (id: number) => Promise<void>;
	selectCodeStandard: (standard: CodeStandard | null) => void;
}

// Review Slice
export interface ReviewSlice {
	currentReview: CodeReviewResponse | null;
	isReviewing: boolean;
	reviewHistory: CodeReviewResponse[];

	reviewCode: (
		code: string,
		framework: string,
		language: string,
		filePath?: string,
	) => Promise<CodeReviewResponse>;
	fetchReviewHistory: (limit?: number) => Promise<void>;
	clearCurrentReview: () => void;
}

// UI Slice
export interface UISlice {
	sidebarOpen: boolean;
	theme: 'light' | 'dark' | 'system';

	setSidebarOpen: (open: boolean) => void;
	setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// App Slice (initialization)
export interface AppSlice {
	isInitialized: boolean;
	isInitializing: boolean;
	initializationError: string | null;

	initializeApp: () => Promise<void>;
}

// Combined Store Type
export type AppStore = UserSlice &
	GitHubSlice &
	OllamaSlice &
	CodeStandardsSlice &
	ReviewSlice &
	UISlice &
	AppSlice;
