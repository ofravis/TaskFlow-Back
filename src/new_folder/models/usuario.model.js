let usuarios = [
    { id: 1, nome: 'Admin', email: 'admin@admin.com', senha: '123456' },
];
let proximoId = 2;

const removerSenha = (usuario) => {
    if (!usuario) return undefined;
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
};

module.exports = {
    listar: () => usuarios.map(removerSenha),
    buscar: (id) => removerSenha(usuarios.find(usuario => usuario.id === id)),
    buscarPorCredenciais: (emailOuNome, senha) => usuarios.find(usuario => {
        const entrada = String(emailOuNome || '').trim().toLowerCase();
        const nome = String(usuario.nome || '').trim().toLowerCase();
        const email = String(usuario.email || '').trim().toLowerCase();
        return (email === entrada || nome === entrada) && usuario.senha === String(senha || '');
    }),
    adicionar: ({ nome, email, senha }) => {
        const novoUsuario = { id: proximoId++, nome, email, senha };
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