const db = require('../database/db');
const prisma = require('../database/prisma');

const prioridadeModel = {
    listar: async () => {
        const resultado = await prisma.prioridade.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return resultado;
    },

    buscarPorId: async (id) => {
        const resultado = await prisma.prioridade.findUnique({
            where: { id }
        });
        return resultado;
    },

    buscarPorNome: async (nome) => {
        const resultado = await prisma.prioridade.findUnique({
            where: { nome }
        });
        return resultado;
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