/**
 * HTML Sanitizer to prevent XSS attacks while allowing rich text content from API.
 * Works seamlessly in both SSR and client environments.
 */

const ALLOWED_TAGS = new Set([
	"p",
	"br",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"s",
	"strike",
	"sub",
	"sup",
	"ul",
	"ol",
	"li",
	"blockquote",
	"pre",
	"code",
	"hr",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td",
	"a",
	"img",
	"span",
	"div",
	"figure",
	"figcaption",
]);

const ALLOWED_ATTRS = new Set([
	"href",
	"src",
	"alt",
	"title",
	"class",
	"target",
	"rel",
	"width",
	"height",
	"loading",
	"colspan",
	"rowspan",
]);

export function sanitizeHtml(rawHtml?: string | null): string {
	if (!rawHtml) return "";

	// If in browser, use DOMParser for accurate DOM sanitization
	if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
		try {
			const parser = new DOMParser();
			const doc = parser.parseFromString(rawHtml, "text/html");

			function cleanNode(node: Node) {
				const children = Array.from(node.childNodes);
				for (const child of children) {
					if (child.nodeType === Node.ELEMENT_NODE) {
						const el = child as HTMLElement;
						const tagName = el.tagName.toLowerCase();

						if (!ALLOWED_TAGS.has(tagName)) {
							// Unwrap or remove non-allowed tag
							el.remove();
							continue;
						}

						// Remove non-allowed attributes & javascript: URLs
						const attrs = Array.from(el.attributes);
						for (const attr of attrs) {
							const attrName = attr.name.toLowerCase();
							const attrValue = attr.value.trim().toLowerCase();

							if (attrName.startsWith("on") || !ALLOWED_ATTRS.has(attrName)) {
								el.removeAttribute(attr.name);
							} else if ((attrName === "href" || attrName === "src") && attrValue.startsWith("javascript:")) {
								el.removeAttribute(attr.name);
							}
						}

						// For external links, enforce noopener noreferrer
						if (tagName === "a" && el.getAttribute("target") === "_blank") {
							el.setAttribute("rel", "noopener noreferrer");
						}

						cleanNode(child);
					} else if (child.nodeType === Node.COMMENT_NODE) {
						child.remove();
					}
				}
			}

			cleanNode(doc.body);
			return doc.body.innerHTML;
		} catch {
			// Fallback to regex sanitizer below
		}
	}

	// Server-side / fallback regex-based stripping
	let sanitized = rawHtml;

	// Strip script, iframe, object, embed, form tags and their contents
	sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
	sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
	sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
	sanitized = sanitized.replace(/<embed\b[^>]*>/gi, "");
	sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

	// Strip inline on* handlers
	sanitized = sanitized.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

	// Strip javascript: in href/src
	sanitized = sanitized.replace(/\b(?:href|src)\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, "");

	return sanitized;
}
