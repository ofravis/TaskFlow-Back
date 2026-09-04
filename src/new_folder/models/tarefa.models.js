let tarefas = [
    { id: 1, texto: 'Estudar Node.js', prioridade: 'alta', coluna: 'andamento' },
    { id: 2, texto: 'Fazer exercícios', prioridade: 'media', coluna: 'afazer' },
];
let proximoId = 3;

module.exports = {
    listar: () => tarefas,
    listarPorColuna: (coluna) => tarefas.filter(tarefa => tarefa.coluna === coluna),
    buscar: (id) => tarefas.find(tarefa => tarefa.id === id),

    adicionar: ({ texto, prioridade = 'media', coluna = 'afazer' }) => {
        const nova = { id: proximoId++, texto, prioridade, coluna };
        tarefas.push(nova);
        return nova;
    },

    atualizar: (id, dados) => {
        const indice = tarefas.findIndex(tarefa => tarefa.id === id);
        if (indice === -1) return undefined;

        tarefas[indice] = { ...tarefas[indice], ...dados, id };
        return tarefas[indice];
    },

    remover: (id) => {
        const indice = tarefas.findIndex(tarefa => tarefa.id === id);
        if (indice === -1) return undefined;

        return tarefas.splice(indice, 1)[0];
    },
};