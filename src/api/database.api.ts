import { invoke } from '@tauri-apps/api/core';
import type { AppConfig, CodeReviewResponse, CodeStandard } from '@/schemas';

export class DatabaseAPI {
	async initDatabase(): Promise<string> {
		return invoke<string>('init_database');
	}

	/**
	 * Save a code standard
	 */
	async saveCodeStandard(standard: CodeStandard): Promise<number> {
		return invoke<number>('save_code_standard', { standard });
	}

	/**
	 * Get all code standards
	 */
	async getCodeStandards(): Promise<CodeStandard[]> {
		return invoke<CodeStandard[]>('get_code_standards');
	}

	/**
	 * Get a code standard by ID
	 */
	async getCodeStandardById(id: number): Promise<CodeStandard> {
		return invoke<CodeStandard>('get_code_standard_by_id', { id });
	}

	/**
	 * Update a code standard
	 */
	async updateCodeStandard(id: number, standard: CodeStandard): Promise<void> {
		return invoke<void>('update_code_standard', { id, standard });
	}
	/**
	 * Delete a code standard
	 */
	async deleteCodeStandard(id: number): Promise<void> {
		return invoke<void>('delete_code_standard', { id });
	}

	/**
	 * Save user configuration
	 */
	async saveUserConfig(config: AppConfig): Promise<void> {
		return invoke<void>('save_user_config', { config });
	}

	/**
	 * Get user configuration
	 */
	async getUserConfig(): Promise<AppConfig | null> {
		return invoke<AppConfig | null>('get_user_config');
	}

	/**
	 * Save review history
	 */
	async saveReviewHistory(
		filePath: string,
		framework: string,
		language: string,
		reviewResult: string,
		issuesFound: number,
	): Promise<number> {
		return invoke<number>('save_review_history', {
			filePath,
			framework,
			language,
			reviewResult,
			issuesFound,
		});
	}

	/**
	 * Get review history
	 */
	async getReviewHistory(limit: number = 50): Promise<CodeReviewResponse[]> {
		return invoke<CodeReviewResponse[]>('get_review_history', { limit });
	}
}

export const databaseAPI = new DatabaseAPI();
