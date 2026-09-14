const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não informado' });
    }

    const [prefixo, token] = authHeader.split(' ');

    if (prefixo !== 'Bearer' || !token) {
        return res.status(401).json({ erro: 'Formato inválido. Use: Bearer <token>' });
    }

    try {
        const segredo = process.env.JWT_SECRET || 'taskflow-secret-dev';
        const payload = jwt.verify(token, segredo);
        req.usuario = payload;
        return next();
    } catch (erro) {
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
        }

        return res.status(401).json({ erro: 'Token inválido.' });
    }
}

module.exports = autenticar;

