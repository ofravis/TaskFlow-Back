const express = require('express');

const router = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

router.get('/estatisticas', tarefasController.estatisticas);
router.get('/resumo', tarefasController.resumo);
router.get('/', tarefasController.listar);
router.post('/', tarefasController.criar);
router.get('/:id', tarefasController.buscarPorId);
router.put('/:id', tarefasController.atualizar);
router.delete('/:id', tarefasController.remover);

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
router.get('/', tarefasController.listar);
router.get('/:id', tarefasController.buscarPorId);
router.post('/',

validar(schemas.tarefa),
tarefasController.criar);
router.put('/:id'),

validar(schemas.tarefa),

module.exports = router;