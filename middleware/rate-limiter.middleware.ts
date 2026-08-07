import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message:
            "Too many  requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message:
            "Too many registration requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
})
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message:
            "Too many login requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
})
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message:
            "Too many password reset requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
})
