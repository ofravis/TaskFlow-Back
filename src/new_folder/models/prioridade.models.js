const prisma = require('../database/prisma');

const prioridadeModel = {
    listar: async () => {
        const resultado = await prisma.prioridades.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return resultado;
    },

    buscarPorId: async (id) => {
        const resultado = await prisma.prioridades.findUnique({
            where: { id }
        });
        return resultado;
    },

    criar: async (dados = {}) => {
        return prisma.prioridades.create({ data: dados });
    },

    atualizar: async (id, dados = {}) => {
        return prisma.prioridades.update({
            where: { id },
            data: dados
        });
    },

    remover: async (id) => {
        return prisma.prioridades.delete({ where: { id } });
    }
};

module.exports = prioridadeModel;