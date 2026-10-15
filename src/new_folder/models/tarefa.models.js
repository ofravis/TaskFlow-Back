const pool = require('../database/db');

module.exports = {
    listar: async () => {
        const result = await pool.query(
            'SELECT * FROM tarefas ORDER BY id'
        );
        return result.rows;
    },

    buscar: async (id) => {
        const result = await pool.query(
            'SELECT * FROM tarefas WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },
};

async criar(req, res) {
    const { texto, prioridade, coluna, usuarioId, ordem } = req.body;

    if (!texto)
        return res.status(400).json({ error: 'O campo "texto" é obrigatório.' });

    if (!prioridade && prioridade !== 0)
        return res.status(400).json({ error: 'O campo "prioridade" é obrigatório.' });

    if (!coluna)
        return res.status(400).json({ error: 'O campo "coluna" é obrigatório.' });

    if (!usuarioId)
        return res.status(400).json({ error: 'O campo "usuarioId" é obrigatório.' });

    try {