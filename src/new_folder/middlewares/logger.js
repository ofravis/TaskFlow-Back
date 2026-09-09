function logger(req, res, next) {
    const inicio = Date.now();
    const metodo = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    res.on('finish', () => {
        const agora = new Date().toISOString();
        const duracao = Date.now() - inicio;
        console.log(`[${agora}] ${metodo} ${url} - ${res.statusCode} - ${duracao}ms - IP: ${ip}`);
    });

    next();
}

module.exports = logger;
