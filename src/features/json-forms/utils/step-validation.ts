import type { ErrorObject } from 'ajv';

/**
 * Checks whether any AJV errors belong to the given step's fields.
 * Handles both:
 *  - `required` errors  (instancePath = "" , params.missingProperty = fieldName)
 *  - other errors       (instancePath = "/fieldName")
 */
export const hasStepErrors = (
  errors: ErrorObject[],
  stepFieldNames: string[]
): boolean =>
  errors.some((err) => {
    const missing = (err.params as any)?.missingProperty as string | undefined;
    if (missing && stepFieldNames.includes(missing)) return true;
    const field = err.instancePath?.replace(/^\//, '');
    return field ? stepFieldNames.includes(field) : false;
  });

/**
 * Returns true when the step is fully valid (no errors for its fields).
 */
export const isStepValid = (
  errors: ErrorObject[],
  stepFieldNames: string[]
): boolean => !hasStepErrors(errors, stepFieldNames);
