/**
 * Formats a date string into "DD - Month - YYYY" format.
 * Returns "—" if the input is null, undefined, or empty.
 * Returns the original string if it's not a valid date.
 * Uses Indonesian locale (id-ID).
 */
export function formatDate(dateStr?: string | null): string {
	if (!dateStr) return "—";
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return dateStr;
	return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" })
		.format(date)
		.replace(/ /g, " ");
}
