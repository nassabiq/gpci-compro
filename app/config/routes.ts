/**
 * Daftar route yang menggunakan layout "landing" (main full-bleed, tanpa padding atas).
 *
 * - string biasa  → exact match  (misal "/" hanya cocok dengan "/")
 * - string + "*"  → prefix match (misal "/products/*" cocok dengan "/products/my-slug" dll.)
 */
export const landingRoutes: string[] = [
	"/",
	"/about",
	"/products",
	"/products/*",
];

/**
 * Daftar route yang menggunakan header transparan (text putih).
 * Hanya untuk halaman yang punya hero/background gelap di atas.
 */
export const transparentHeaderRoutes: string[] = [
	"/",
	"/about",
	"/products",
];

/** Cek apakah path cocok dengan salah satu route dalam list */
function matchRoute(path: string, routes: string[]): boolean {
	return routes.some((r) => {
		if (r.endsWith("/*")) return path.startsWith(r.slice(0, -1));
		return path === r;
	});
}

/** Cek apakah path termasuk landing route (full-bleed, no top padding) */
export function isLandingRoute(path: string): boolean {
	return matchRoute(path, landingRoutes);
}

/** Cek apakah path memerlukan header transparan */
export function isTransparentHeaderRoute(path: string): boolean {
	return matchRoute(path, transparentHeaderRoutes);
}
