"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const defaultErrorFormatter = (issues, source) => ({
    errors: issues.map((issue) => ({
        type: 'field',
        value: issue.input,
        msg: issue.message,
        path: issue.path.join('.'),
        location: source,
    })),
});
const validate = (schema, options = {}) => {
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
            return res.status(400).json(options.errorFormatter
                ? options.errorFormatter(result.error.issues, source)
                : defaultErrorFormatter(result.error.issues, source));
        }
        next();
    };
};
exports.validate = validate;
