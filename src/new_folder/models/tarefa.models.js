let tarefas = [];
let proximoId = 1;

module.exports = {
    listar: () => tarefas,
    listarPorColuna: (coluna) => tarefas.filter(tarefa => tarefa.coluna === coluna),
    listarPorUsuario: (usuarioId) => tarefas.filter(tarefa => tarefa.usuarioId === usuarioId),
    listarPorProjeto: (projetoId) => tarefas.filter(tarefa => tarefa.projetoId === projetoId),
    buscar: (id) => tarefas.find(tarefa => tarefa.id === id),

    adicionar: ({ texto, prioridade = 'media', coluna = 'afazer', usuarioId, projetoId, cep, cidade, uf }) => {
        const nova = { id: proximoId++, texto, prioridade, coluna };
        if (usuarioId !== undefined) nova.usuarioId = usuarioId;
        if (projetoId !== undefined) nova.projetoId = projetoId;
        if (cep !== undefined) nova.cep = cep;
        if (cidade !== undefined) nova.cidade = cidade;
        if (uf !== undefined) nova.uf = uf;
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