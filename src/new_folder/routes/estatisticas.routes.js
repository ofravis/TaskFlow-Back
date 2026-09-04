const express = require('express');

const router = express.Router();
let usuarios = [];
let proximoId = 1;
let usuarioId = 1;

    router.get('/', (req, res) => res.json(usuarios));
    router.get('/:id', (req, res) => {
const u = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(u);
});

router.post('/', (req, res) => {
const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios' });
    if (usuarios.find(u => u.email === email))
return res.status(400).json({ erro: 'Email já cadastrado' });
const novo = { id: proximoId++, nome, email };
    usuarios.push(novo);
    res.status(201).json(novo);
});

router.post('/usuarioId', (req, res) => {
const { usuarioId } = req.body;
    if (!usuarioId) return res.status(400).json({ erro: 'usuarioId é obrigatório' });
    const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(usuario);
});


router.put('/:id', (req, res) => {
const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });
usuarios[idx] = { ...usuarios[idx], ...req.body, id: usuarios[idx].id };
    res.json(usuarios[idx]);
});
router.delete('/:id', (req, res) => {
    const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });
const removido = usuarios.splice(idx, 1)[0];
res.json({ mensagem: 'Usuário removido', usuario: removido });
});


router.get('/estatisticas', (req, res) => {
const { coluna } = req.query;
const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;
const total = base.length;
const porColuna = {

afazer: base.filter(t => t.coluna === 'afazer').length,
andamento: base.filter(t => t.coluna === 'andamento').length,
concluido: base.filter(t => t.coluna === 'concluido').length,
};

const porPrioridade = {
alta: base.filter(t => t.prioridade === 'alta').length,
media: base.filter(t => t.prioridade === 'media').length,
baixa: base.filter(t => t.prioridade === 'baixa').length,
};
res.json({ coluna: coluna || 'todas', total, porColuna, porPrioridade });
});



module.exports = router;