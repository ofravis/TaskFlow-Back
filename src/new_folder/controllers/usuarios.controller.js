const usuarioModel = require('../models/usuario.model');
const tarefaModel = require('../models/tarefa.models');

const idValido = (valor) => /^\d+$/.test(valor) && Number(valor) > 0;

const usuariosController = {
    listar(req, res) {
        res.json(usuarioModel.listar());
    },

    buscarPorId(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const usuario = usuarioModel.buscar(Number(req.params.id));
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    criar(req, res) {
        const { nome, email } = req.body;
        if (typeof nome !== 'string' || !nome.trim() || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ erro: 'Nome e email obrigatórios' });
        }
        const emailNormalizado = email.trim().toLowerCase();
        if (usuarioModel.listar().some(usuario => usuario.email === emailNormalizado)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const novoUsuario = usuarioModel.adicionar({ nome: nome.trim(), email: emailNormalizado });
        res.status(201).json(novoUsuario);
    },

    atualizar(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        if (!usuarioModel.buscar(id)) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const { nome, email } = req.body;
        if (nome !== undefined && (typeof nome !== 'string' || !nome.trim())) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }
        if (email !== undefined && (typeof email !== 'string' || !email.trim())) {
            return res.status(400).json({ erro: 'Email inválido' });
        }
        const emailNormalizado = email === undefined ? undefined : email.trim().toLowerCase();
        if (emailNormalizado && usuarioModel.listar().some(usuario => usuario.email === emailNormalizado && usuario.id !== id)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const usuario = usuarioModel.atualizar(id, {
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(emailNormalizado !== undefined && { email: emailNormalizado }),
        });
        res.json(usuario);
    },

    remover(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const usuario = usuarioModel.buscar(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        if (tarefaModel.listarPorUsuario(id).length > 0) {
            return res.status(400).json({ erro: 'Usuário possui tarefas. Remova as tarefas antes de deletar o usuário.' });
        }

        const usuarioRemovido = usuarioModel.remover(id);
        res.json({ mensagem: 'Usuário removido', usuario: usuarioRemovido });
    },
};

module.exports = usuariosController;