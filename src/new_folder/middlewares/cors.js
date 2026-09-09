function corsMiddleware(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'https://www.google.com');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
}