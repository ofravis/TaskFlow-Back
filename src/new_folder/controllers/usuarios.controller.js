const usuarioModel = require('../models/usuario.model');
const tarefaModel = require('../models/tarefa.models');

const idValido = (valor) => /^\d+$/.test(String(valor)) && Number(valor) > 0;

const usuariosController = {
    async listar(req, res) {
        res.json(await usuarioModel.listar());
    },

    async buscarPorId(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const usuario = await usuarioModel.buscar(Number(req.params.id));
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    async criar(req, res) {
        const { nome, email, senha } = req.body;
        if (typeof nome !== 'string' || !nome.trim() || typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha.trim()) {
            return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
        }

        const emailNormalizado = email.trim().toLowerCase();
        if (await usuarioModel.buscarPorEmail(emailNormalizado)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const novoUsuario = await usuarioModel.adicionar({
            nome: nome.trim(),
            email: emailNormalizado,
            senha: senha.trim(),
        });
        res.status(201).json(novoUsuario);
    },

    async atualizar(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const atual = await usuarioModel.buscar(id);
        if (!atual) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const { nome, email, senha } = req.body;
        if (nome !== undefined && (typeof nome !== 'string' || !nome.trim())) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }
        if (email !== undefined && (typeof email !== 'string' || !email.trim())) {
            return res.status(400).json({ erro: 'Email inválido' });
        }
        if (senha !== undefined && (typeof senha !== 'string' || !senha.trim())) {
            return res.status(400).json({ erro: 'Senha inválida' });
        }

        const emailNormalizado = email === undefined ? undefined : email.trim().toLowerCase();
        if (emailNormalizado) {
            const usuarioComEmail = await usuarioModel.buscarPorEmail(emailNormalizado);
            if (usuarioComEmail && usuarioComEmail.id !== id) {
                return res.status(400).json({ erro: 'Email já cadastrado' });
            }
        }

        const usuario = await usuarioModel.atualizar(id, {
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(emailNormalizado !== undefined && { email: emailNormalizado }),
            ...(senha !== undefined && { senha: senha.trim() }),
        });
        res.json(usuario);
    },

    async remover(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const usuario = await usuarioModel.buscar(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        if (await tarefaModel.contarPorUsuario(id) > 0) {
            return res.status(400).json({ erro: 'Usuário possui tarefas. Remova as tarefas antes de deletar o usuário.' });
        }

        const usuarioRemovido = await usuarioModel.remover(id);
        res.json({ mensagem: 'Usuário removido', usuario: usuarioRemovido });
    },
};

module.exports = usuariosController;
