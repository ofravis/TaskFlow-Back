const projetoModel = require('../models/projeto.model');
const tarefaModel = require('../models/tarefa.models');

const idValido = (valor) => /^\d+$/.test(valor) && Number(valor) > 0;

const projetosController = {
    listar(req, res) {
        res.json(projetoModel.listar());
    },

    buscarPorId(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const projeto = projetoModel.buscar(Number(req.params.id));
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        res.json(projeto);
    },

    criar(req, res) {
        const { nome, descricao } = req.body;
        if (typeof nome !== 'string' || !nome.trim()) {
            return res.status(400).json({ erro: 'Nome obrigatório' });
        }
        const projeto = projetoModel.adicionar({ nome: nome.trim(), descricao: descricao === undefined ? '' : descricao });
        res.status(201).json(projeto);
    },

    atualizar(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        if (!projetoModel.buscar(id)) return res.status(404).json({ erro: 'Projeto não encontrado' });
        const { nome, descricao } = req.body;
        if (nome !== undefined && (typeof nome !== 'string' || !nome.trim())) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }
        const projeto = projetoModel.atualizar(id, {
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(descricao !== undefined && { descricao }),
        });
        res.json(projeto);
    },

    remover(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const projeto = projetoModel.buscar(id);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        if (tarefaModel.listarPorProjeto(id).length > 0) {
            return res.status(400).json({ erro: 'Projeto possui tarefas associadas. Remova as tarefas antes.' });
        }
        res.json({ mensagem: 'Projeto removido', projeto: projetoModel.remover(id) });
    },

    resumo(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const projeto = projetoModel.buscar(id);
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        const tarefas = tarefaModel.listarPorProjeto(id);
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