const express = require('express');
const prioridadeModel = require('../models/prioridade.models');

const router = express.Router();

const idValido = (id) => /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;

router.get('/', async (req, res) => {
	try {
		const prioridades = await prioridadeModel.listar();
		return res.status(200).json(prioridades);
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao buscar prioridades.', erro: error.message });
	}
});


router.get('/:id', async (req, res) => {
	if (!idValido(req.params.id)) {
		return res.status(400).json({ mensagem: 'ID inválido.' });
	}

	try {
		const prioridade = await prioridadeModel.buscarPorId(Number(req.params.id));
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
		const prioridade = await prioridadeModel.criar(req.body);
		return res.status(201).json(prioridade);
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro ao criar prioridade.', erro: error.message });
	}
});


router.put('/:id', async (req, res) => {
	if (!idValido(req.params.id)) {
		return res.status(400).json({ mensagem: 'ID inválido.' });
	}

	try {
		const prioridade = await prioridadeModel.buscarPorId(Number(req.params.id));
		if (!prioridade) {
			return res.status(404).json({ mensagem: 'Prioridade não encontrada.' });
		}

		const atualizada = await prioridadeModel.atualizar(Number(req.params.id), req.body);
		return res.status(200).json(atualizada);
	} catch (error) {
		return res.status(400).json({ mensagem: 'Erro ao atualizar prioridade.', erro: error.message });
	}
});


router.delete('/:id', async (req, res) => {
	if (!idValido(req.params.id)) {
		return res.status(400).json({ mensagem: 'ID inválido.' });
	}

	try {
		const prioridade = await prioridadeModel.buscarPorId(Number(req.params.id));
		if (!prioridade) {
			return res.status(404).json({ mensagem: 'Prioridade não encontrada.' });
		}

		await prioridadeModel.remover(Number(req.params.id));
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro ao remover prioridade.', erro: error.message });
	}
});

module.exports = router;
