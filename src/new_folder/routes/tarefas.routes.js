const express = require('express');
const router = express.Router();

let tarefas = [];
let proximoId = 1;

router.get('/estatisticas', (req, res) => {
    const { coluna } = req.query;
    const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;

    const total = base.length;
    const porColuna = {
        afazer: base.filter(t => t.coluna === 'afazer').length,
        andamento: base.filter(t => t.coluna === 'andamento').length,
        concluido: base.filter(t => t.coluna === 'concluido').length,
    };

    const porPrioridade = {
        alta: base.filter(t => t.prioridade === 'alta').length,
        media: base.filter(t => t.prioridade === 'media').length,
        baixa: base.filter(t => t.prioridade === 'baixa').length,
    };

    res.json({ coluna: coluna || 'todas', total, porColuna, porPrioridade });
});

router.get('/', (req, res) => {
    const { coluna, prioridade } = req.query;
    let resultado = tarefas;

    if (coluna) {
        resultado = resultado.filter(tarefa => tarefa.coluna === coluna);
    }

    if (prioridade) {
        resultado = resultado.filter(tarefa => tarefa.prioridade === prioridade);
    }

    res.json(resultado);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(tarefa);
});

router.post('/', (req, res) => {
    const { texto, prioridade, coluna } = req.body;

    if (!texto) {
        return res.status(400).json({ erro: 'Texto obrigatório' });
    }

    const nova = {
        id: proximoId++,
        texto,
        prioridade: prioridade || 'media',
        coluna: coluna || 'afazer',
    };

    tarefas.push(nova);
    res.status(201).json(nova);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = tarefas.findIndex(t => t.id === id);

    if (idx === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    tarefas[idx] = { ...tarefas[idx], ...req.body, id };
    res.json(tarefas[idx]);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = tarefas.findIndex(t => t.id === id);

    if (idx === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const removida = tarefas.splice(idx, 1)[0];
    res.json({ mensagem: 'Tarefa removida', tarefa: removida });
});

module.exports = router;