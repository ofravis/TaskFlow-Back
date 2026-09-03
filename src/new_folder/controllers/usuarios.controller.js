let usuarios = [];
let proximoId = 1;

const usuariosController = {
    listar(req, res) {
        res.json(usuarios);
    },

    buscarPorId(req, res) {
        const id = parseInt(req.params.id, 10);
        const usuario = usuarios.find(item => item.id === id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    criar(req, res) {
        const { nome, email } = req.body;
        if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios' });
        if (usuarios.some(usuario => usuario.email === email)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const novoUsuario = { id: proximoId++, nome, email };
        usuarios.push(novoUsuario);
        res.status(201).json(novoUsuario);
    },

    atualizar(req, res) {
        const id = parseInt(req.params.id, 10);
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const { email } = req.body;
        if (email && usuarios.some(usuario => usuario.email === email && usuario.id !== id)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        usuarios[indice] = { ...usuarios[indice], ...req.body, id };
        res.json(usuarios[indice]);
    },

    remover(req, res) {
        const id = parseInt(req.params.id, 10);
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const usuarioRemovido = usuarios.splice(indice, 1)[0];
        res.json({ mensagem: 'Usuário removido', usuario: usuarioRemovido });
    },
};

module.exports = usuariosController;