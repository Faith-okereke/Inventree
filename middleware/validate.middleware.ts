import { RequestHandler } from 'express';
import { z } from 'zod';

type ValidationSource = 'body' | 'params' | 'query' | 'headers';

type ValidateOptions = {
    source?: ValidationSource;
    errorFormatter?: (issues: z.ZodIssue[], source: ValidationSource) => unknown;
};

const defaultErrorFormatter = (issues: z.ZodIssue[], source: ValidationSource) => ({
    errors: issues.map((issue) => ({
        type: 'field',
        value: issue.input,
        msg: issue.message,
        path: issue.path.join('.'),
        location: source,
    })),
});

export const validate = <T extends z.ZodTypeAny>(schema: T, options: ValidateOptions = {}): RequestHandler => {
    const source = options.source ?? 'body';

    return (req, res, next) => {
        const payload = source === 'body'
            ? req.body
            : source === 'params'
                ? req.params
                : source === 'query'
                    ? req.query
                    : req.headers;

        const result = schema.safeParse(payload);

        if (!result.success) {
            return res.status(400).json(
                options.errorFormatter
                    ? options.errorFormatter(result.error.issues, source)
                    : defaultErrorFormatter(result.error.issues, source),
            );
        }

        next();
    };
};
