// Validation helpers for Edge Function request bodies

/**
 * Check that all required fields are present and non-empty in a body object.
 * Returns an error message string, or null if all required fields are present.
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  fields: string[],
): string | null {
  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

/**
 * Validate that a string is a valid UUID v4.
 */
export function isValidUUID(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(value);
}

/**
 * Parse request body as JSON. Returns null on parse failure.
 */
export async function parseBody(
  req: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (!text) return {};
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}
