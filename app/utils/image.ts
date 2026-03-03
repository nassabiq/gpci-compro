export const FALLBACK_IMG = "/img/empty-image.png";

/**
 * Resolves the full image URL based on MinIO configuration.
 * - If src is empty/null, returns fallback image.
 * - If src is absolute URL (http/https), returns it as is.
 * - If src starts with "img/" or "/img/", treats it as a static asset.
 * - Otherwise, constructs a MinIO URL using runtime config.
 */
export function getImageSrc(src?: string | null): string {
	const config = useRuntimeConfig();
	const minioBaseUrl = String(config.public.minioBaseUrl ?? "").trim().replace(/\/+$/, "");
	const minioProductFolder = String(config.public.minioProductFolder ?? "")
		.trim()
		.replace(/^\/+/, "")
		.replace(/\/+$/, "");

	const s = (src ?? "").trim();
	if (!s) return FALLBACK_IMG;

	// Check for absolute URL
	if (/^https?:\/\//i.test(s)) return s;

	// Check for static assets
	if (s.startsWith("img/") || s.startsWith("/img/")) {
		return s.startsWith("/") ? s : `/${s}`;
	}

	// Clean path for MinIO construction
	const clean = s.replace(/^\/+/, "");

	// Construct MinIO URL
	if (!minioBaseUrl) return `/${clean}`;
	if (!minioProductFolder) return `${minioBaseUrl}/${clean}`;
	
	// Avoid double folder if already present
	if (clean.startsWith(`${minioProductFolder}/`)) {
		return `${minioBaseUrl}/${clean}`;
	}
	
	return `${minioBaseUrl}/${minioProductFolder}/${clean}`;
}
