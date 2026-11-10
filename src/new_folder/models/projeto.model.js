const prisma = require('../database/prisma');

const projetoModel = {
    listar: (usuarioId) => prisma.projetos.findMany({
        where: { usuario_id: usuarioId },
        orderBy: { id: 'asc' },
    }),

    buscar: (id, usuarioId) => prisma.projetos.findFirst({
        where: { id, usuario_id: usuarioId },
    }),

    obterOuCriarPadrao: async (usuarioId) => {
        const projeto = await prisma.projetos.findFirst({
            where: { usuario_id: usuarioId },
            orderBy: { id: 'asc' },
        });
        if (projeto) return projeto;

        return prisma.projetos.create({
            data: {
                nome: 'Meu projeto',
                descricao: '',
                usuario_id: usuarioId,
            },
        });
    },

    adicionar: ({ nome, descricao, usuario_id }) => prisma.projetos.create({
        data: { nome, descricao, usuario_id },
    }),

    atualizar: async (id, usuarioId, dados) => {
        const resultado = await prisma.projetos.updateMany({
            where: { id, usuario_id: usuarioId },
            data: dados,
        });
        if (resultado.count === 0) return null;
        return prisma.projetos.findUnique({ where: { id } });
    },

    remover: async (id, usuarioId) => {
        const projeto = await prisma.projetos.findFirst({
            where: { id, usuario_id: usuarioId },
        });
        if (!projeto) return null;

        await prisma.projetos.delete({ where: { id } });
        return projeto;
    },
};

module.exports = projetoModel;
