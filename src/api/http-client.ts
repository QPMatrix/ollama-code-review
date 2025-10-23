import { type ClientOptions, fetch } from '@tauri-apps/plugin-http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResponseParser = 'json' | 'text' | 'arrayBuffer' | 'raw';
type FetchOptions = RequestInit & ClientOptions;

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

export interface HttpClient {
	setBaseUrl(baseUrl: string): void;
	setDefaultHeaders(headers: Record<string, string>): void;
	updateDefaultHeaders(
		headers: Record<string, string | null | undefined>,
	): void;
	setDefaultResponseType(responseType: ResponseParser): void;
	request<TResponse = unknown, TBody = unknown>(
		path: string,
		options?: RequestOptions<TBody>,
	): Promise<TResponse>;
	get<TResponse = unknown>(
		path: string,
		options?: Omit<RequestOptions, 'method' | 'body'>,
	): Promise<TResponse>;
	post<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	): Promise<TResponse>;
	put<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	): Promise<TResponse>;
	patch<TResponse = unknown, TBody = unknown>(
		path: string,
		body: TBody,
		options?: Omit<RequestOptions<TBody>, 'method' | 'body'>,
	): Promise<TResponse>;
	delete<TResponse = unknown, TBody = unknown>(
		path: string,
		options?: Omit<RequestOptions<TBody>, 'method'>,
	): Promise<TResponse>;
}

export const createHttpClient = (config: HttpClientConfig = {}): HttpClient => {
	let baseUrl = config.baseUrl;
	let defaultHeaders = { ...config.defaultHeaders };
	let defaultResponseType: ResponseParser =
		config.defaultResponseType ?? 'json';

	const hasHeader = (headers: Record<string, string>, name: string) => {
		const target = name.toLowerCase();
		return Object.keys(headers).some((key) => key.toLowerCase() === target);
	};

	const mergeHeaders = (headers?: Record<string, string>) =>
		headers ? { ...defaultHeaders, ...headers } : { ...defaultHeaders };

	const normalizeQuery = (
		query?: Record<string, string | number | boolean | null | undefined>,
	): Record<string, string> | undefined => {
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
	};

	const serializeBody = <TBody>(
		body: TBody,
		headers: Record<string, string>,
	): BodyInit | null | undefined => {
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
			return body as unknown as BodyInit;
		}

		if (
			body !== null &&
			typeof body === 'object' &&
			!(typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
		) {
			if (!hasHeader(headers, 'content-type')) {
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
	};

	const resolveUrl = (path: string) => {
		if (!baseUrl) {
			return path;
		}

		try {
			return new URL(path, baseUrl).toString();
		} catch {
			return path;
		}
	};

	const extractResponseData = async <T>(
		response: Awaited<ReturnType<typeof fetch>>,
		responseType: ResponseParser,
	): Promise<T> => {
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
	};

	const request = async <TResponse = unknown, TBody = unknown>(
		path: string,
		options: RequestOptions<TBody> = {},
	): Promise<TResponse> => {
		const {
			method = 'GET',
			headers,
			body,
			query,
			responseType = defaultResponseType,
			timeout,
			skipErrorThrow,
		} = options;

		let url = resolveUrl(path);
		const mergedHeaders = mergeHeaders(headers);
		const fetchOptions: FetchOptions = {
			method,
			headers: mergedHeaders,
		};

		const normalizedQuery = normalizeQuery(query);
		if (normalizedQuery) {
			const queryString = new URLSearchParams(normalizedQuery).toString();
			const separator = url.includes('?') ? '&' : '?';
			url = `${url}${separator}${queryString}`;
		}

		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		if (timeout !== undefined) {
			const controller = new AbortController();
			fetchOptions.signal = controller.signal;
			timeoutId = setTimeout(() => {
				controller.abort();
			}, timeout);
		}

		if (body !== undefined) {
			const preparedBody = serializeBody(body, mergedHeaders);
			if (preparedBody !== undefined) {
				fetchOptions.body = preparedBody;
			}
		}

		let response: Awaited<ReturnType<typeof fetch>>;
		try {
			response = await fetch(url, fetchOptions);
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error(`Request to ${url} timed out after ${timeout}ms`);
			}
			throw error;
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}

		if (!response.ok && !skipErrorThrow) {
			const errorBody = await response.text().catch(() => undefined);
			throw new Error(
				`Request to ${url} failed with status ${response.status}${
					errorBody ? `: ${errorBody}` : ''
				}`,
			);
		}

		return extractResponseData<TResponse>(response, responseType);
	};

	return {
		setBaseUrl(nextBaseUrl) {
			baseUrl = nextBaseUrl;
		},
		setDefaultHeaders(headers) {
			defaultHeaders = { ...headers };
		},
		updateDefaultHeaders(headers) {
			const nextHeaders = { ...defaultHeaders };

			for (const [key, value] of Object.entries(headers)) {
				if (value === null || value === undefined) {
					delete nextHeaders[key];
				} else {
					nextHeaders[key] = value;
				}
			}

			defaultHeaders = nextHeaders;
		},
		setDefaultResponseType(responseType) {
			defaultResponseType = responseType;
		},
		request,
		get(path, options) {
			return request(path, { ...options, method: 'GET' });
		},
		post(path, body, options) {
			return request(path, { ...options, method: 'POST', body });
		},
		put(path, body, options) {
			return request(path, { ...options, method: 'PUT', body });
		},
		patch(path, body, options) {
			return request(path, { ...options, method: 'PATCH', body });
		},
		delete(path, options) {
			return request(path, { ...options, method: 'DELETE' });
		},
	};
};

export const httpClient = createHttpClient();
