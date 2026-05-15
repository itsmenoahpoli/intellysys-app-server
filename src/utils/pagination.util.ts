/**
 * Clamps an integer value within the specified range.
 * Handles string inputs (from query params) and provides a fallback for invalid values.
 */
export const clampInt = (
  raw: unknown,
  fallback: number,
  min: number,
  max: number,
): number => {
  const n = typeof raw === "string" ? Number(raw) : Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
};

/**
 * Normalizes sort parameters with validation against allowed fields.
 * Defaults to the provided default field if the sortBy value is not allowed.
 */
export const normalizeSort = <TAllowed extends string>(
  sortByRaw: string | undefined,
  sortOrderRaw: string | undefined,
  allowedFields: readonly TAllowed[],
  defaultField: TAllowed,
): { sortBy: TAllowed; sortOrder: "asc" | "desc" } => {
  const sortBy = allowedFields.includes(sortByRaw as TAllowed)
    ? (sortByRaw as TAllowed)
    : defaultField;
  const sortOrder = sortOrderRaw?.toLowerCase() === "asc" ? "asc" : "desc";
  return { sortBy, sortOrder };
};

/**
 * Calculates pagination values from query parameters.
 * Returns page, limit, and skip (offset) values.
 */
export const calculatePagination = (
  pageRaw: unknown,
  limitRaw: unknown,
  options?: {
    defaultPage?: number;
    defaultLimit?: number;
    maxPage?: number;
    maxLimit?: number;
  },
): { page: number; limit: number; skip: number } => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxPage = 10_000,
    maxLimit = 100,
  } = options ?? {};

  const page = clampInt(pageRaw, defaultPage, 1, maxPage);
  const limit = clampInt(limitRaw, defaultLimit, 1, maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Calculates total pages from total count and limit.
 */
export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.max(1, Math.ceil(total / limit));
};
