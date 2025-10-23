import { type ClientOptions, fetch } from '@tauri-apps/plugin-http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResponseParser = 'json' | 'text' | 'arrayBuffer' | 'raw';

interface FetchOptions extends RequestInit, ClientOptions {
	query?: Record<string, string>;
	timeout?: number;
}

export interface HttpClientConfig {
	baseUrl?: string;
	defaultHeaders?: Record<string, string>;
	defaultResponseType?: ResponseParser;
}

export interface RequestOptions<TBody = unknown> {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: TBody;
	query?: Record<string, string | number | boolean | null | undefined>;
	responseType?: ResponseParser;
	timeout?: number;
	skipErrorThrow?: boolean;
}

export class HttpClient {
	private baseUrl?: string;
	private defaultHeaders: Record<string, string>;
	private defaultResponseType: ResponseParser;

	constructor(config: HttpClientConfig = {}) {
		this.baseUrl = config.baseUrl;
		this.defaultHeaders = { ...config.defaultHeaders };
		this.defaultResponseType = config.defaultResponseType ?? 'json';
	}

	setBaseUrl(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	setDefaultHeaders(headers: Record<string, string>) {
		this.defaultHeaders = { ...headers };
	}

	updateDefaultHeaders(headers: Record<string, string | null | undefined>) {
		const nextHeaders = { ...this.defaultHeaders };

		for (const [key, value] of Object.entries(headers)) {
			if (value === null || value === undefined) {
				delete nextHeaders[key];
			} else {
				nextHeaders[key] = value;
			}
		}

		this.defaultHeaders = nextHeaders;
	}

	setDefaultResponseType(responseType: ResponseParser) {
		this.defaultResponseType = responseType;
	}

	async request<TResponse = unknown, TBody = unknown>(
		path: string,
		options: RequestOptions<TBody> = {},
	): Promise<TResponse> {
		const {
			method = 'GET',
			headers,
			body,
			query,
			responseType = this.defaultResponseType,
			timeout,
		} = options;

		const url = this.resolveUrl(path);
		const mergedHeaders = this.mergeHeaders(headers);
		const fetchOptions: FetchOptions = {
			method,
			headers: mergedHeaders,
		};

		if (timeout !== undefined) {
			fetchOptions.timeout = timeout;
		}

		const normalizedQuery = this.normalizeQuery(query);
		if (normalizedQuery) {
			fetchOptions.query = normalizedQuery;
		}

		if (body !== undefined) {
			const preparedBody = this.serializeBody(body, mergedHeaders);

			if (preparedBody !== undefined) {
				fetchOptions.body = preparedBody;
			}
		}

		const response = await fetch(url, fetchOptions);

		if (!response.ok && !options.skipErrorThrow) {
			const errorBody = await response.text().catch(() => undefined);
			const error = new Error(
				`Request to ${url} failed with status ${response.status}${
					errorBody ? `: ${errorBody}` : ''
				}`,
			);
			throw error;
		}

		return this.extractResponseData<TResponse>(response, responseType);
	}

	get<TResponse = unknown>(
		path: string,
		options?: Omit<RequestOptions, 'method' | 'body'>,
	) {
		return this.request<TResponse>(path, { ...options, method: 'GET' });
	}

	post<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	) {
		return this.request<TResponse, TBody>(path, {
			...options,
			method: 'POST',
			body,
		});
	}

	put<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	) {
		return this.request<TResponse, TBody>(path, {
			...options,
			method: 'PUT',
			body,
		});
	}

	patch<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	) {
		return this.request<TResponse, TBody>(path, {
			...options,
			method: 'PATCH',
			body,
		});
	}

	delete<TResponse = unknown, TBody = unknown>(
		path: string,
		options?: Omit<RequestOptions<TBody>, 'method'>,
	) {
		return this.request<TResponse, TBody>(path, {
			...options,
			method: 'DELETE',
		});
	}

	private mergeHeaders(headers?: Record<string, string>) {
		return headers
			? {
					...this.defaultHeaders,
					...headers,
				}
			: { ...this.defaultHeaders };
	}

	private normalizeQuery(
		query?: Record<string, string | number | boolean | null | undefined>,
	): Record<string, string> | undefined {
		if (!query) {
			return undefined;
		}

		const entries = Object.entries(query).flatMap(([key, value]) => {
			if (value === null || value === undefined) {
				return [];
			}

			return [[key, String(value)] as [string, string]];
		});

		if (entries.length === 0) {
			return undefined;
		}

		return Object.fromEntries(entries);
	}

	private serializeBody<TBody>(
		body: TBody,
		headers: Record<string, string>,
	): BodyInit | null | undefined {
		if (body instanceof Uint8Array) {
			return body as unknown as BodyInit;
		}

		if (typeof body === 'string') {
			return body;
		}

		if (typeof FormData !== 'undefined' && body instanceof FormData) {
			return body;
		}

		if (
			(typeof URLSearchParams !== 'undefined' &&
				body instanceof URLSearchParams) ||
			(typeof Blob !== 'undefined' && body instanceof Blob) ||
			body instanceof ArrayBuffer
		) {
			return body;
		}

		if (
			body !== null &&
			typeof body === 'object' &&
			!(typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
		) {
			if (!this.hasHeader(headers, 'content-type')) {
				headers['Content-Type'] = 'application/json';
			}
			return JSON.stringify(body);
		}

		if (body === null) {
			return null;
		}

		if (
			typeof body === 'number' ||
			typeof body === 'boolean' ||
			typeof body === 'bigint'
		) {
			return String(body);
		}

		return body as BodyInit;
	}

	private resolveUrl(path: string) {
		if (!this.baseUrl) {
			return path;
		}

		try {
			return new URL(path, this.baseUrl).toString();
		} catch {
			return path;
		}
	}

	private hasHeader(headers: Record<string, string>, name: string) {
		const target = name.toLowerCase();
		return Object.keys(headers).some((key) => key.toLowerCase() === target);
	}

	private async extractResponseData<T>(
		response: Awaited<ReturnType<typeof fetch>>,
		responseType: ResponseParser = this.defaultResponseType,
	): Promise<T> {
		switch (responseType) {
			case 'text':
				return (await response.text()) as unknown as T;
			case 'arrayBuffer':
				return (await response.arrayBuffer()) as unknown as T;
			case 'raw':
				return response as unknown as T;
			default:
				return (await response.json()) as unknown as T;
		}
	}
}

export const httpClient = new HttpClient();
