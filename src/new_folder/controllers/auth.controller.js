const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.model');

const authController = {
    login(req, res) {
        const { email, senha } = req.body;

        if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha.trim()) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const usuario = usuarioModel.buscarPorCredenciais(email.trim(), senha.trim());

        if (!usuario) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
            },
            process.env.JWT_SECRET || 'taskflow-secret-dev',
            { expiresIn: '8h' }
        );

        return res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
        });
    },
};

module.exports = authController;
