const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
const authHeader = req.headers['authorization'];

if (!authHeader)

return res.status(401).json({ erro: 'Token não informado' });
const token = authHeader.split(' ')[1];
if (!token)
return res.status(401)
.json({ erro: 'Formato inválido. Use: Bearer <token>' });



try {

const payload = jwt.verify(token, process.env.JWT_SECRET);
req.usuario = payload;

next();
} catch (erro) {
if (erro.name === 'TokenExpiredError')
return res.status(401)
.json({ erro: 'Token expirado. Faça login novamente.' });
return res.status(401).json({ erro: 'Token inválido.' });
}
}

module.exports = autenticar;