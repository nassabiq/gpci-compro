export function buildPublicApiHeaders(config: ReturnType<typeof useRuntimeConfig>): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: "application/json",
	};

	const clientId = String(config.public.clientId ?? "").trim();
	const clientPassword = String(config.public.clientPassword ?? "").trim();

	if (clientId) headers["x-client-id"] = clientId;
	if (clientPassword) headers["x-client-password"] = clientPassword;

	return headers;
}
