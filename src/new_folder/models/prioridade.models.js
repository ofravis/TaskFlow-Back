const db = require('../database/db');

const prioridadeModel = {
    listar: async () => {
        const resultado = await db.query('SELECT * FROM prioridades ORDER BY id');
        return resultado.rows;
    },

    buscarPorId: async (id) => {
        const resultado = await db.query(
            'SELECT * FROM prioridades WHERE id = $1',
            [id]
        );
        return resultado.rows[0] || null;
    },

    buscarPorNome: async (nome) => {
        const resultado = await db.query(
            'SELECT * FROM prioridades WHERE nome = $1 LIMIT 1',
            [nome]
        );
        return resultado.rows[0] || null;
    },

    criar: async (dados = {}) => {
        const { nome, valor, descricao, cor } = dados;

        const resultado = await db.query(
            `INSERT INTO prioridades (nome, valor, descricao, cor)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nome, valor, descricao, cor]
        );

        return resultado.rows[0];
    },

    atualizar: async (id, dados = {}) => {
        const campos = [];
        const valores = [];

        Object.entries(dados).forEach(([chave, valor]) => {
            if (valor !== undefined) {
                campos.push(`${chave} = $${campos.length + 1}`);
                valores.push(valor);
            }
        });

        if (!campos.length) {
            return null;
        }

        valores.push(id);

        const resultado = await db.query(
            `UPDATE prioridades
             SET ${campos.join(', ')}
             WHERE id = $${campos.length + 1}
             RETURNING *`,
            valores
        );

        return resultado.rows[0] || null;
    },

    remover: async (id) => {
        const resultado = await db.query(
            'DELETE FROM prioridades WHERE id = $1 RETURNING *',
            [id]
        );

        return resultado.rows[0] || null;
    }
};

module.exports = prioridadeModel;