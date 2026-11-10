const projetoModel = require('../models/projeto.model');
const tarefaModel = require('../models/tarefa.models');

const idValido = (valor) => /^\d+$/.test(String(valor)) && Number(valor) > 0;

const projetosController = {
    async listar(req, res) {
        res.json(await projetoModel.listar(req.usuario.id));
    },

    async buscarPorId(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const projeto = await projetoModel.buscar(Number(req.params.id), req.usuario.id);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        res.json(projeto);
    },

    async criar(req, res) {
        const { nome, descricao } = req.body;
        if (typeof nome !== 'string' || !nome.trim()) {
            return res.status(400).json({ erro: 'Nome obrigatório' });
        }
        const projeto = await projetoModel.adicionar({
            nome: nome.trim(),
            descricao: descricao === undefined ? '' : descricao,
            usuario_id: req.usuario.id,
        });
        res.status(201).json(projeto);
    },

    async atualizar(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const { nome, descricao } = req.body;
        if (nome !== undefined && (typeof nome !== 'string' || !nome.trim())) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }

        const dados = {
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(descricao !== undefined && { descricao }),
        };
        const projeto = await projetoModel.atualizar(Number(req.params.id), req.usuario.id, dados);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        res.json(projeto);
    },

    async remover(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const projeto = await projetoModel.buscar(id, req.usuario.id);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        if (await tarefaModel.contarPorProjeto(id) > 0) {
            return res.status(400).json({ erro: 'Projeto possui tarefas associadas. Remova as tarefas antes.' });
        }

        res.json({ mensagem: 'Projeto removido', projeto: await projetoModel.remover(id, req.usuario.id) });
    },

    async resumo(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const projeto = await projetoModel.buscar(id, req.usuario.id);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        const tarefas = await tarefaModel.listarPorProjeto(id);
        res.json({
            projeto,
            totalTarefas: tarefas.length,
            porColuna: {
                afazer: tarefas.filter(tarefa => tarefa.coluna === 'afazer').length,
                andamento: tarefas.filter(tarefa => tarefa.coluna === 'andamento').length,
                concluido: tarefas.filter(tarefa => tarefa.coluna === 'concluido').length,
            },
        });
    },
};

module.exports = projetosController;
