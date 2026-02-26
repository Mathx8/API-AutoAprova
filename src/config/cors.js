import cors from 'cors';

export const corsOptions = {
    origin: [
        'http://localhost:3000',
    ],

    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

export function enforceHttps(req, res, next) {
    if (req.method === 'OPTIONS') return next();

    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps && !req.hostname.includes('localhost')) {
        const httpsUrl = `https://${req.headers.host}${req.url}`;
        return res.redirect(301, httpsUrl);
    }

    next();
}

export function addCorsHeaders(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '600');
    next();
}