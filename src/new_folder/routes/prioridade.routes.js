const express = require('express');
const { Prioridade } = require('../models');

const router = express.Router();


router.get('/', async (req, res) => {
	try {
		const prioridades = await Prioridade.findAll();
		return res.status(200).json(prioridades);
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao buscar prioridades.', erro: error.message });
	}
});


router.get('/:id', async (req, res) => {
	try {
		const prioridade = await Prioridade.findByPk(req.params.id);
		if (!prioridade) {
			return res.status(404).json({ mensagem: 'Prioridade não encontrada.' });
		}
		return res.status(200).json(prioridade);
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao buscar prioridade.', erro: error.message });
	}
});

router.post('/', async (req, res) => {
	try {
		const prioridade = await Prioridade.create(req.body);
		return res.status(201).json(prioridade);
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro ao criar prioridade.', erro: error.message });
	}
});


router.put('/:id', async (req, res) => {
	try {
		const prioridade = await Prioridade.findByPk(req.params.id);
		if (!prioridade) {
			return res.status(404).json({ mensagem: 'Prioridade não encontrada.' });
		}

		await prioridade.update(req.body);
		return res.status(200).json(prioridade);
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro ao atualizar prioridade.', erro: error.message });
	}
});


router.delete('/:id', async (req, res) => {
	try {
		const prioridade = await Prioridade.findByPk(req.params.id);
		if (!prioridade) {
			return res.status(404).json({ mensagem: 'Prioridade não encontrada.' });
		}

		await prioridade.destroy();
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao remover prioridade.', erro: error.message });
	}
});

module.exports = router;
