import type {
	AppConfig,
	CodeReviewResponse,
	CodeStandard,
	GitHubOrganization,
	GitHubRepository,
	GitHubUser,
	OllamaModel,
} from '@/schemas/schemas.types';

export interface UserState {
	userConfig: AppConfig | null;
	githubUser: GitHubUser | null;
	isGitHubAuthenticated: boolean;

	setUserConfig: (config: AppConfig) => Promise<void>;
	loginWithGitHub: (token: string) => Promise<void>;
	logoutGitHub: () => Promise<void>;
	loadUserConfig: () => Promise<void>;
}

export interface GitHubState {
	githubOrgs: GitHubOrganization[];
	githubRepos: GitHubRepository[];

	fetchGitHubOrgs: () => Promise<void>;
	fetchGitHubRepos: () => Promise<void>;
	searchRepositories: (query: string) => Promise<void>;
	clearGitHubData: () => void;
}

export interface OllamaState {
	ollamaModels: OllamaModel[];
	selectedModel: string | null;
	isOllamaConnected: boolean;

	fetchOllamaModels: () => Promise<void>;
	selectModel: (model: string) => Promise<void>;
	checkOllamaConnection: () => Promise<void>;
}

export interface CodeStandardsState {
	codeStandards: CodeStandard[];
	selectedCodeStandard: CodeStandard | null;

	fetchCodeStandards: () => Promise<void>;
	saveCodeStandard: (standard: CodeStandard) => Promise<void>;
	updateCodeStandard: (id: number, standard: CodeStandard) => Promise<void>;
	deleteCodeStandard: (id: number) => Promise<void>;
	selectCodeStandard: (standard: CodeStandard | null) => void;
}

export interface ReviewState {
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

export interface UIState {
	sidebarOpen: boolean;
	theme: 'light' | 'dark' | 'system';
	currentPage: string;

	setSidebarOpen: (open: boolean) => void;
	setTheme: (theme: 'light' | 'dark' | 'system') => void;
	setCurrentPage: (page: string) => void;
}

export interface AppState {
	isInitialized: boolean;
	isInitializing: boolean;
	initializationError: string | null;

	initializeApp: () => Promise<void>;
}
