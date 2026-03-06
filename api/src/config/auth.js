const DEFAULT_JWT_SECRET = 'your-super-secret-jwt-key-change-in-prod';

export function getJwtSecret() {
    const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

    if (process.env.NODE_ENV === 'production' && secret === DEFAULT_JWT_SECRET) {
        throw new Error('JWT_SECRET must be set in production');
    }

    return secret;
}

export function logAuthConfigWarning(logger) {
    if ((process.env.JWT_SECRET || DEFAULT_JWT_SECRET) === DEFAULT_JWT_SECRET && process.env.NODE_ENV !== 'production') {
        logger.warn('JWT_SECRET is not set; using the development fallback secret');
    }
}
