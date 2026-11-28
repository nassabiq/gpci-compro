export interface EditorialCategory {
	uuid?: string;
	name: string;
	slug: string;
	description?: string;
	sequence?: number;
	is_active?: boolean;
	articles_count?: number;
}

export interface EditorialAuthor {
	name: string;
}

export interface EditorialArticle {
	uuid: string;
	title: string;
	slug: string;
	excerpt: string;
	content?: string | null;
	cover_image_url?: string | null;
	is_featured?: boolean;
	featured_slogan?: string | null;
	published_date: string;
	published_at: string;
	views_count: number;
	category: {
		uuid?: string;
		name: string;
		slug: string;
	};
	author: EditorialAuthor;
}

export interface EditorialArticlesMeta {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

export interface EditorialArticlesResponse {
	data: EditorialArticle[];
	meta: EditorialArticlesMeta;
}

export interface EditorialCategoriesResponse {
	data: EditorialCategory[];
}

export interface EditorialFeaturedResponse {
	data: EditorialArticle | null;
	message?: string;
}

export interface EditorialArticleDetailResponse {
	data: EditorialArticle;
}

export interface ArticleQueryParams {
	limit?: number;
	page?: number;
	"filter[search]"?: string;
	"filter[category]"?: string;
	"filter[is_featured]"?: boolean;
	sort?: "-published_at" | "published_at" | "title" | "-views_count" | "views_count" | string;
}

export interface SubscribePayload {
	email: string;
}

export interface SubscribeResponseData {
	uuid?: string;
	email: string;
	is_active?: boolean;
	subscribed_at?: string;
}

export interface SubscribeResponse {
	data: SubscribeResponseData;
	message: string;
}
