import type {
  ApiListResponse,
  Property,
  PropertyQuery,
  PropertySortBy,
  PropertySortOrder,
  RawSearchParams,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*                                  endpoints                                 */
/* -------------------------------------------------------------------------- */

/** Change these two if the backend routes move. */
export const PROPERTIES_ENDPOINT = "/api/properties/available";

export const PROPERTIES_PER_PAGE = 9;

export const PROPERTY_SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "rentAmount:asc", label: "Price: low to high" },
  { value: "rentAmount:desc", label: "Price: high to low" },
] as const;

export const DEFAULT_SORT = "createdAt:desc";

/* -------------------------------------------------------------------------- */
/*                               query handling                               */
/* -------------------------------------------------------------------------- */

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function toPositiveInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Keep only digits so "1,200" and "1200৳" both resolve to "1200". */
function toAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length > 0 ? digits : "";
}

/**
 * Turns raw `searchParams` into a fully-resolved query. Every unknown or
 * malformed value falls back to a default, so a hand-edited URL can never put
 * the page into a broken state.
 */
export function parsePropertyQuery(params: RawSearchParams): PropertyQuery {
  const sortRaw = first(params.sort) || DEFAULT_SORT;
  const matched = PROPERTY_SORT_OPTIONS.some(
    (option) => option.value === sortRaw,
  )
    ? sortRaw
    : DEFAULT_SORT;
  const [sortBy, sortOrder] = matched.split(":") as [
    PropertySortBy,
    PropertySortOrder,
  ];

  // Note: min/max are NOT reordered here. The parsed query drives the filter
  // inputs, and silently swapping them would rewrite the field the visitor is
  // still typing into. The swap happens when the outbound request is built.
  return {
    searchTerm: first(params.searchTerm),
    minPrice: toAmount(first(params.minPrice)),
    maxPrice: toAmount(first(params.maxPrice)),
    sortBy,
    sortOrder,
    page: toPositiveInt(first(params.page), 1),
    limit: PROPERTIES_PER_PAGE,
  };
}

/**
 * Serialises a query back into the URL, omitting defaults and empty values.
 *
 * Values are normalised exactly the way `parsePropertyQuery` will read them
 * back — otherwise the filter inputs would fight the URL round-trip (a typed
 * trailing space would come back trimmed and clobber the field mid-keystroke).
 */
export function buildPropertySearchParams(
  query: Partial<PropertyQuery> & { sort?: string },
): URLSearchParams {
  const params = new URLSearchParams();

  const searchTerm = query.searchTerm?.trim() ?? "";
  const minPrice = toAmount(query.minPrice ?? "");
  const maxPrice = toAmount(query.maxPrice ?? "");

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (query.sort && query.sort !== DEFAULT_SORT) params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));

  return params;
}

/** Builds the canonical `/properties` href for a query. */
export function buildPropertiesHref(
  query: Partial<PropertyQuery> & { sort?: string },
): string {
  const qs = buildPropertySearchParams(query).toString();
  return qs ? `/properties?${qs}` : "/properties";
}

/* -------------------------------------------------------------------------- */
/*                                  fetchers                                  */
/* -------------------------------------------------------------------------- */

function emptyResult(
  overrides: Partial<ApiListResponse<Property>> = {},
): ApiListResponse<Property> {
  return {
    success: false,
    statusCode: 500,
    message: "Unable to load properties.",
    data: [],
    meta: { page: 1, limit: PROPERTIES_PER_PAGE, total: 0, totalPages: 0 },
    ...overrides,
  };
}

/**
 * Fetches one page of available properties.
 *
 * Note: the backend's `searchTerm` matches `location` only — it does not look
 * at title or description. The UI labels the input accordingly.
 */
export async function getAvailableProperties(
  query: PropertyQuery,
): Promise<ApiListResponse<Property>> {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  // A reversed range would match nothing, so order it here — at the edge —
  // rather than in the parsed query that the filter inputs render from.
  const reversed =
    query.minPrice !== "" &&
    query.maxPrice !== "" &&
    Number(query.minPrice) > Number(query.maxPrice);

  const minPrice = reversed ? query.maxPrice : query.minPrice;
  const maxPrice = reversed ? query.minPrice : query.maxPrice;

  if (query.searchTerm) params.set("searchTerm", query.searchTerm);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);

  const url = `${process.env.BACKEND_API_URL}${PROPERTIES_ENDPOINT}?${params}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return emptyResult({
        statusCode: res.status,
        message: `Properties request failed (${res.status}).`,
      });
    }

    const result = (await res.json()) as ApiListResponse<Property>;

    return {
      ...result,
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta ?? {
        page: query.page,
        limit: query.limit,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("[properties] fetch failed:", error);
    return emptyResult();
  }
}

