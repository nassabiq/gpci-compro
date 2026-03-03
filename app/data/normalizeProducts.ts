// data/normalizeProducts.ts
import type {Product} from "./products";

/** Struktur mentah sesuai products_raw.json */
export type RawRoot = RawItem[];
export type RawItem = {
	code: string;
	product_category: string;
	products: Array<{
		company: string; // nama perusahaan
		status: "Active" | "Inactive" | string;
		brands: string[]; // daftar brand (tiap brand = 1 kartu produk)
		link?: string;
	}>;
};

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

/** Optional: gambar default per kategori (silakan tambah sesuai kebutuhan) */
const categoryImageMap: Record<string, string> = {
	"Ceramic Tile & Granite": "/images/certified-building.jpg",
	"Paint": "/images/certified-consumer.jpg",
	// ... tambahkan mapping lain
};

/**
 * Ubah JSON mentah (kategori → perusahaan → brands) menjadi Product[] untuk UI.
 */
export function normalizeProducts(raw: RawRoot): Product[] {
	const out: Product[] = [];

	for (const cat of raw) {
		const category = (cat.product_category || "").trim();
		const fallbackImage = categoryImageMap[category] || "/images/certified-consumer.jpg";

		for (const p of cat.products || []) {
			const company = (p.company || "").trim();
			const isActive = String(p.status || "").toLowerCase() === "active";
			const baseId = `${cat.code}-${slugify(company)}`;

			// deskripsi & features default
			const desc = isActive ? `Certified brand(s) under ${company}.` : `Brand(s) previously certified; current status inactive.`;
			const features = isActive ? ["Certified", "Low impact", "Meets GPCI criteria"] : ["Historical record"];

			for (const b of p.brands || []) {
				const brand = String(b || "").trim();
				if (!brand) continue;
				const id = `${baseId}-${slugify(brand)}`;

				out.push({
					id,
					slug: id,
					title: brand,
					image: fallbackImage,
					images: [fallbackImage],
					company,
					status: isActive, // default sederhana
					category,
					description: desc,
					features,
					// certificationDate: tidak ada pada sumber → biarkan undefined
				});
			}
		}
	}

	return out;
}
