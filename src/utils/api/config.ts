const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

// Use relative path in production (same domain), absolute URL in development
const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction 
  ? '' // Use relative path when deployed (same domain)
  : sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
const API_PREFIX = sanitizeBaseUrl(import.meta.env.VITE_API_PREFIX || '/api');

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  prefix: API_PREFIX,
};

export function buildApiUrl(endpoint: string) {
  const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${API_PREFIX}${sanitizedEndpoint}`;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

