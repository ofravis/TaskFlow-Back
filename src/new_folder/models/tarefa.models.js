let tarefas = [
    {id: 1, texto: 'Estudar Node.js', prioridade: 'alta', coluna: 'andamento'},
    {id: 2, texto: 'Fazer exercícios', prioridade: 'media', coluna: 'afazer'},
];
let proximoId = 3;

module.exports = {
    listar: () => tarefas,

    listarPorColuna: (coluna) => tarefas.filter(tarefa => tarefa.coluna === coluna),

    buscar: (id) => tarefas.find(tarefa => tarefa.id === id),

    adicionar: ({texto, prioridade, coluna}) => {
        const nova = {id: proximoId++, texto, 
            prioridade: prioridade || 'media',
            coluna: coluna || 'afazer'};
        tarefas.push(nova);
        return nova;
    },
}