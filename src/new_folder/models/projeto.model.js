let projetos = [];
let proximoId = 1;

module.exports = {
    listar: () => projetos,
    buscar: (id) => projetos.find(projeto => projeto.id === id),
    adicionar: ({ nome, descricao }) => {
        const novoProjeto = { id: proximoId++, nome, descricao };
        projetos.push(novoProjeto);
        return novoProjeto;
    },
    atualizar: (id, dados) => {
        const indice = projetos.findIndex(projeto => projeto.id === id);
        if (indice === -1) return undefined;
        projetos[indice] = { ...projetos[indice], ...dados, id };
        return projetos[indice];
    },
    remover: (id) => {
        const indice = projetos.findIndex(projeto => projeto.id === id);
        if (indice === -1) return undefined;
        return projetos.splice(indice, 1)[0];
    },
};