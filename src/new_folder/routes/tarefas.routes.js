const express = require('express');
const router = express.Router();

let tarefas = [];
let proximaId = 1;

router.get('/', (req, res) => {
    const {coluna} = req.query
    let resultado = tarefas;
    if (coluna) resultado = tarefas.filter(tarefa => tarefa.coluna === coluna);
    res.json(resultado);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(tarefa);
});