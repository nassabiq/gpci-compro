import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";
import { normalizeBaseUrl } from "~/utils/url";

export function buildPublicApiHeaders(
	config: ReturnType<typeof useRuntimeConfig>,
	options?: { isPost?: boolean; headers?: Record<string, string> }
): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: "application/json",
		...(options?.headers ?? {}),
	};

	if (options?.isPost) {
		headers["Content-Type"] = "application/json";
	}

	const clientId = String(config.public.clientId ?? "").trim();
	const clientPassword = String(config.public.clientPassword ?? "").trim();

	if (clientId) headers["x-client-id"] = clientId;
	if (clientPassword) headers["x-client-password"] = clientPassword;

	return headers;
}

export function resolvePublicApiBase(config?: ReturnType<typeof useRuntimeConfig>): string {
	const conf = config ?? useRuntimeConfig();
	const apiBase = String(conf.public.apiBase ?? "").trim();
	const appName = String(conf.public.appName ?? "").trim();
	return normalizeBaseUrl(apiBase, appName) || normalizeBaseUrl(apiBase) || normalizeBaseUrl(appName);
}

export interface PublicApiFetchOptions extends Omit<NitroFetchOptions<NitroFetchRequest>, "headers"> {
	headers?: Record<string, string>;
	isPost?: boolean;
}

export async function fetchPublicApi<T>(
	endpoint: string,
	options: PublicApiFetchOptions = {}
): Promise<T> {
	const config = useRuntimeConfig();
	const base = resolvePublicApiBase(config);

	if (!base) {
		throw new Error(
			"Public API base URL is not configured. Please set PUBLIC_API_BASE_URL or NUXT_PUBLIC_API_BASE in .env"
		);
	}

	const isPost = options.isPost ?? (options.method && ["POST", "PUT", "PATCH"].includes(options.method.toUpperCase()));
	const headers = buildPublicApiHeaders(config, { isPost: !!isPost, headers: options.headers });

	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const normalizedBase = base.replace(/\/+$/, "");
	const url = `${normalizedBase}${cleanEndpoint}`;

	return await $fetch<T>(url, {
		...options,
		headers,
	});
}

export interface ApiValidationError {
	message: string;
	errors?: Record<string, string[]>;
}

export function isNotFoundError(error: any): boolean {
	return error?.statusCode === 404 || error?.status === 404 || error?.response?.status === 404;
}

export function isValidationError(error: any): boolean {
	return error?.statusCode === 422 || error?.status === 422 || error?.response?.status === 422;
}

export function extractValidationError(error: any): ApiValidationError {
	const data = error?.response?._data ?? error?.data;
	return {
		message: data?.message || error?.message || "Validation error occurred.",
		errors: data?.errors || {},
	};
}
