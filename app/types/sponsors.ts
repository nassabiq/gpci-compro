export interface Sponsor {
	uuid: string;
	name: string;
	slug: string;
	logo_url: string | null;
	website_url: string | null;
	sequence: number;
	is_active: boolean;
}

export interface SponsorsMeta {
	current_page?: number;
	last_page?: number;
	total?: number;
	per_page?: number;
}

export interface SponsorsResponse {
	data: Sponsor[];
	meta?: SponsorsMeta;
}

export interface SponsorQueryParams {
	limit?: number;
	page?: number;
	"filter[search]"?: string;
	sort?: "sequence" | "name" | "created_at" | string;
}
