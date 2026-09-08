let usuarios = [];
let proximoId = 1;

module.exports = {
    listar: () => usuarios,
    buscar: (id) => usuarios.find(usuario => usuario.id === id),
    adicionar: ({ nome, email }) => {
        const novoUsuario = { id: proximoId++, nome, email };
        usuarios.push(novoUsuario);
        return novoUsuario;
    },
    atualizar: (id, dados) => {
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return undefined;
        usuarios[indice] = { ...usuarios[indice], ...dados, id };
        return usuarios[indice];
    },
    remover: (id) => {
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return undefined;
        return usuarios.splice(indice, 1)[0];
    },
};