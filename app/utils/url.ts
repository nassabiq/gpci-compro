export function isAbsoluteHttpUrl(value: string): boolean {
	return /^https?:\/\//i.test(value);
}

export function normalizeBaseUrl(value?: string, originBase?: string): string {
	const raw = String(value ?? "").trim();
	if (!raw) return "";

	if (isAbsoluteHttpUrl(raw)) {
		return raw.replace(/\/+$/, "");
	}

	// Local dev host without scheme (e.g. localhost:8000 or 127.0.0.1:8000)
	if (/^(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(raw)) {
		return `http://${raw}`.replace(/\/+$/, "");
	}

	// Relative path with origin
	if (raw.startsWith("/") && originBase) {
		const origin = String(originBase).trim().replace(/\/+$/, "");
		if (isAbsoluteHttpUrl(origin)) return `${origin}${raw}`.replace(/\/+$/, "");
	}

	// Plain domain name without scheme (e.g. api.domain.com)
	if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(raw)) {
		return `https://${raw}`.replace(/\/+$/, "");
	}

	return "";
}
