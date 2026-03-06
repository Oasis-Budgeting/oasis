import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/auth.js';

const JWT_SECRET = getJwtSecret();

export default async function authenticate(request, reply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.user = { id: decoded.userId };
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return reply.code(401).send({ error: 'Invalid or expired token' });
        }
        return reply.code(500).send({ error: 'Authentication failed' });
    }
}
