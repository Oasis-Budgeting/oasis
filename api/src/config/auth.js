import crypto from 'crypto';

// Generate a secure random secret if none is provided to prevent hardcoded secret vulnerabilities
const FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');

export function getJwtSecret() {
    const secret = process.env.JWT_SECRET || FALLBACK_SECRET;

    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set in production');
    }

    return secret;
}

export function logAuthConfigWarning(logger) {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
        logger.warn('JWT_SECRET is not set; using a temporary random secret. User sessions will not persist across server restarts.');
    }
}
