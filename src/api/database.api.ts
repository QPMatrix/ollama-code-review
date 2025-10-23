import type { invoke } from '@tauri-apps/api/core';
import type { AppConfig, CodeReviewResponse, CodeStandard } from '@/schemas';

type Invoke = typeof invoke;

const getGlobalInvoker = (): Invoke | undefined => {
	const global = globalThis as unknown as {
		__TAURI__?: {
			invoke?: Invoke;
			core?: { invoke?: Invoke };
		};
	};
	return global.__TAURI__?.core?.invoke ?? global.__TAURI__?.invoke;
};

const isTauriAvailable = () => Boolean(getGlobalInvoker());

const safeInvoke = async <T>(
	command: string,
	args?: Record<string, unknown>,
) => {
	const invoker = getGlobalInvoker();
	if (!invoker) {
		return undefined as T;
	}
	return invoker<T>(command, args);
};

export const initDatabase = async () =>
	safeInvoke<string>('init_database') ?? Promise.resolve('noop');

export const saveCodeStandard = async (standard: CodeStandard) =>
	safeInvoke<number>('save_code_standard', { standard }) ?? Promise.resolve(0);

export const getCodeStandards = async () =>
	safeInvoke<CodeStandard[]>('get_code_standards') ?? Promise.resolve([]);

export const getCodeStandardById = async (id: number) => {
	const result = await safeInvoke<CodeStandard>('get_code_standard_by_id', {
		id,
	});
	if (result === undefined && !isTauriAvailable()) {
		throw new Error('Tauri invoke not available in this environment');
	}
	return result as CodeStandard;
};

export const updateCodeStandard = async (id: number, standard: CodeStandard) =>
	safeInvoke<void>('update_code_standard', { id, standard }) ??
	Promise.resolve();

export const deleteCodeStandard = async (id: number) =>
	safeInvoke<void>('delete_code_standard', { id }) ?? Promise.resolve();

export const saveUserConfig = async (config: AppConfig) =>
	safeInvoke<void>('save_user_config', { config }) ?? Promise.resolve();

export const getUserConfig = async () =>
	safeInvoke<AppConfig | null>('get_user_config') ?? Promise.resolve(null);

export const saveReviewHistory = async (
	filePath: string,
	framework: string,
	language: string,
	reviewResult: string,
	issuesFound: number,
) =>
	safeInvoke<number>('save_review_history', {
		filePath,
		framework,
		language,
		reviewResult,
		tissuesFound,
	}) ?? Promise.resolve(0);

export const getReviewHistory = async (limit: number = 50) =>
	safeInvoke<CodeReviewResponse[]>('get_review_history', { limit }) ??
	Promise.resolve([]);

export const databaseAPI = {
	initDatabase,
	saveCodeStandard,
	getCodeStandards,
	getCodeStandardById,
	updateCodeStandard,
	deleteCodeStandard,
	saveUserConfig,
	getUserConfig,
	saveReviewHistory,
	getReviewHistory,
};
