const express = require('express');
const router = express.Router();

let usuarios = [];
let proximoId = 1;

router.get('/', (req, res) => {
    res.json(usuarios);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
});

router.post('/', (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ erro: 'Nome e email obrigatórios' });
    }
    if (usuarios.find(u => u.email === email)) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
    }
    const novo = { id: proximoId++, nome, email };
    usuarios.push(novo);
    res.status(201).json(novo);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const { email } = req.body;
    if (email && usuarios.some(u => u.email === email && u.id !== id)) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
    }
    usuarios[idx] = { ...usuarios[idx], ...req.body, id: usuarios[idx].id };
    res.json(usuarios[idx]);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = usuarios.findIndex(u => u.id === id);

    if (idx === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    const removido = usuarios.splice(idx, 1)[0];
    res.json({ mensagem: 'Usuário removido', usuario: removido });
});

module.exports = router;