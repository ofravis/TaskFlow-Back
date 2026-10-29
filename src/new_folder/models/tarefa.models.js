const prisma = require('../database/prisma');

let tarefas = [];
let proximoId = 1;

const incluirNomes = {
    projetos: { select: { nome: true } },
    usuarios: { select: { nome: true } },
};

module.exports = {
    listar: async () => {
        return prisma.tarefas.findMany({
            include: incluirNomes,
            orderBy: { id: 'asc' },
        });
    },

    buscar: (id) => tarefas.find((tarefa) => tarefa.id === id),

    listarPorUsuario: (usuarioId) => tarefas.filter((tarefa) => tarefa.usuarioId === usuarioId),

    adicionar: ({ texto, prioridade, coluna, usuarioId, projetoId, cep, cidade, uf, concluidaEm }) => {
        const novaTarefa = {
            id: proximoId++,
            texto,
            prioridade,
            coluna,
            usuarioId,
            projetoId,
            cep,
            cidade,
            uf,
            concluidaEm: concluidaEm ?? null,
        };

        tarefas.push(novaTarefa);
        return novaTarefa;
    },

    atualizar: (id, dados) => {
        const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
        if (indice === -1) return undefined;

        tarefas[indice] = {
            ...tarefas[indice],
            ...dados,
            id,
        };

        return tarefas[indice];
    },

    remover: (id) => {
        const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
        if (indice === -1) return undefined;

        const [tarefaRemovida] = tarefas.splice(indice, 1);
        return tarefaRemovida;
    },
};