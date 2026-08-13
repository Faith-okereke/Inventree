/**
 * Flatten a ZodError into `{ field: firstMessage }` for rendering next to inputs.
 *
 * Typed against the structural shape it actually reads rather than
 * `z.ZodError<T>`: zod parameterises errors by a schema's *output* type, which
 * has nothing to do with the input field names this needs to key by.
 */
export function fieldErrors<TKey extends string>(error: {
  issues: readonly { path: readonly PropertyKey[]; message: string }[];
}): Partial<Record<TKey, string>> {
  const result: Partial<Record<TKey, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0] as TKey | undefined;
    // First message per field only — a stack of rules on one input reads as noise.
    if (key && !result[key]) result[key] = issue.message;
  }

  return result;
}
