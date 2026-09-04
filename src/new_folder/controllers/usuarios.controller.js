let usuarios = [];
let proximoId = 1;

const idValido = (valor) => /^\d+$/.test(valor) && Number(valor) > 0;

const usuariosController = {
    listar(req, res) {
        res.json(usuarios);
    },

    buscarPorId(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const usuario = usuarios.find(item => item.id === Number(req.params.id));
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    criar(req, res) {
        const { nome, email } = req.body;
        if (typeof nome !== 'string' || !nome.trim() || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ erro: 'Nome e email obrigatórios' });
        }
        const emailNormalizado = email.trim().toLowerCase();
        if (usuarios.some(usuario => usuario.email === emailNormalizado)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const novoUsuario = { id: proximoId++, nome: nome.trim(), email: emailNormalizado };
        usuarios.push(novoUsuario);
        res.status(201).json(novoUsuario);
    },

    atualizar(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const { nome, email } = req.body;
        if (nome !== undefined && (typeof nome !== 'string' || !nome.trim())) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }
        if (email !== undefined && (typeof email !== 'string' || !email.trim())) {
            return res.status(400).json({ erro: 'Email inválido' });
        }
        const emailNormalizado = email === undefined ? undefined : email.trim().toLowerCase();
        if (emailNormalizado && usuarios.some(usuario => usuario.email === emailNormalizado && usuario.id !== id)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        usuarios[indice] = {
            ...usuarios[indice],
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(emailNormalizado !== undefined && { email: emailNormalizado }),
            id,
        };
        res.json(usuarios[indice]);
    },

    remover(req, res) {
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
        const id = Number(req.params.id);
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const usuarioRemovido = usuarios.splice(indice, 1)[0];
        res.json({ mensagem: 'Usuário removido', usuario: usuarioRemovido });
    },
};

module.exports = usuariosController;