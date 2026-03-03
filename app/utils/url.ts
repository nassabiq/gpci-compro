export function isAbsoluteHttpUrl(value: string): boolean {
	return /^https?:\/\//i.test(value);
}

export function normalizeBaseUrl(value?: string, originBase?: string): string {
	const raw = String(value ?? "").trim();
	if (!raw) return "";
	if (isAbsoluteHttpUrl(raw)) return raw.replace(/\/+$/, "");

	if (raw.startsWith("/") && originBase) {
		const origin = String(originBase).trim().replace(/\/+$/, "");
		if (isAbsoluteHttpUrl(origin)) return `${origin}${raw}`.replace(/\/+$/, "");
	}

	return "";
}
