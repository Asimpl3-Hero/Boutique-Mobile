import { appConfig } from '@lib/constants';

/**
 * Base HTTP client for the Boutique backend.
 * Domain services (lib/services/<domain>/) build their typed clients on top.
 */

const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/** Network failure or timeout — no HTTP response was received. */
export class NetworkError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  /** JSON-serializable request body. */
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { headers, body, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener('abort', () => controller.abort());

  let response: Response;
  try {
    response = await fetch(`${appConfig.apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
  } catch (cause) {
    throw new NetworkError(
      controller.signal.aborted
        ? `Request timed out after ${timeoutMs}ms: ${method} ${path}`
        : `Network request failed: ${method} ${path}`,
      cause,
    );
  } finally {
    clearTimeout(timeout);
  }

  const isJson = response.headers
    .get('Content-Type')
    ?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      `${method} ${path} failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as T;
};

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>('PUT', path, options),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>('PATCH', path, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, options),
};
