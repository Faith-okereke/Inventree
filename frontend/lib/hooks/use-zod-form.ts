"use client";

import { useCallback, useState, useTransition } from "react";
import type { z } from "zod";

import { fieldErrors } from "@/lib/validation/field-errors";

/**
 * Minimal zod-backed form state. Deliberately not a full form library — these
 * two forms need exactly this much: validate on submit, re-validate a field once
 * it has been touched, and clear the error as the user fixes it.
 *
 * Generic over the *input* shape rather than the schema type: every field here is
 * a text input, so `Record<string, string>` is both accurate and something
 * `keyof` can actually be taken of.
 */
export function useZodForm<TValues extends Record<string, string>, TOutput>({
  schema,
  initialValues,
  onValid,
}: {
  schema: z.ZodType<TOutput, TValues>;
  initialValues: TValues;
  onValid?: (values: TOutput) => void | Promise<void>;
}) {
  type Key = keyof TValues & string;
  type Errors = Partial<Record<Key, string>>;

  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [isPending, startTransition] = useTransition();

  const validateField = useCallback(
    (name: Key, next: TValues) => {
      const result = schema.safeParse(next);
      const nextErrors: Errors = result.success
        ? {}
        : fieldErrors<Key>(result.error);

      // Only this field is written, so a message on another field stays put.
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    },
    [schema],
  );

  const handleChange = useCallback(
    (name: Key) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // Computed keys widen an object literal, so the shape is reasserted here.
      const next = { ...values, [name]: event.target.value } as TValues;
      setValues(next);

      // Only surface errors for fields the user has already left, so the form
      // doesn't shout at them mid-typing on first pass.
      if (touched[name]) validateField(name, next);
    },
    [touched, validateField, values],
  );

  const handleBlur = useCallback(
    (name: Key) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, values);
    },
    [validateField, values],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = schema.safeParse(values);
      if (!result.success) {
        setErrors(fieldErrors<Key>(result.error));
        // Mark everything touched so every message shows at once.
        setTouched(
          Object.fromEntries(
            Object.keys(values).map((key) => [key, true]),
          ) as Partial<Record<Key, boolean>>,
        );
        return;
      }

      setErrors({});
      startTransition(async () => {
        await onValid?.(result.data);
      });
    },
    [onValid, schema, values],
  );

  /** Spread onto a <Field> to wire value, handlers and error in one go. */
  const field = useCallback(
    (name: Key) => ({
      id: name,
      name,
      value: values[name] ?? "",
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      error: errors[name],
    }),
    [errors, handleBlur, handleChange, values],
  );

  return { values, errors, isPending, field, handleSubmit };
}
