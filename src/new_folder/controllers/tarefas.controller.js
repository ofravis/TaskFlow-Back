const tarefaModel = require('../models/tarefa.models');

const prioridadesValidas = ['alta', 'media', 'baixa'];
const colunasValidas = ['afazer', 'andamento', 'concluido'];

const idValido = (valor) => /^\d+$/.test(valor) && Number(valor) > 0;

const validarDados = ({ texto, prioridade, coluna }, exigirTexto = false) => {
	if (exigirTexto && (typeof texto !== 'string' || !texto.trim())) return 'Texto obrigatório';
	if (texto !== undefined && (typeof texto !== 'string' || !texto.trim())) return 'Texto inválido';
	if (prioridade !== undefined && !prioridadesValidas.includes(prioridade)) return 'Prioridade inválida';
	if (coluna !== undefined && !colunasValidas.includes(coluna)) return 'Coluna inválida';
	return null;
};

const tarefasController = {
	listar(req, res) {
		const { coluna, prioridade } = req.query;
		if (coluna && !colunasValidas.includes(coluna)) return res.status(400).json({ erro: 'Coluna inválida' });
		if (prioridade && !prioridadesValidas.includes(prioridade)) return res.status(400).json({ erro: 'Prioridade inválida' });

		let resultado = tarefaModel.listar();
		if (coluna) resultado = resultado.filter(tarefa => tarefa.coluna === coluna);
		if (prioridade) resultado = resultado.filter(tarefa => tarefa.prioridade === prioridade);
		res.json(resultado);
	},

	buscarPorId(req, res) {
		if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
		const tarefa = tarefaModel.buscar(Number(req.params.id));
		if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		res.json(tarefa);
	},

	criar(req, res) {
		const erro = validarDados(req.body, true);
		if (erro) return res.status(400).json({ erro });

		const novaTarefa = tarefaModel.adicionar({
			texto: req.body.texto.trim(),
			prioridade: req.body.prioridade,
			coluna: req.body.coluna,
		});
		res.status(201).json(novaTarefa);
	},

	atualizar(req, res) {
		if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
		const erro = validarDados(req.body);
		if (erro) return res.status(400).json({ erro });

		const tarefa = tarefaModel.atualizar(Number(req.params.id), {
			...req.body,
			...(req.body.texto !== undefined && { texto: req.body.texto.trim() }),
		});
		if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		res.json(tarefa);
	},

	remover(req, res) {
		if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
		const tarefaRemovida = tarefaModel.remover(Number(req.params.id));
		if (!tarefaRemovida) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		res.json({ mensagem: 'Tarefa removida', tarefa: tarefaRemovida });
	},

	estatisticas(req, res) {
		const { coluna } = req.query;
		if (coluna && !colunasValidas.includes(coluna)) return res.status(400).json({ erro: 'Coluna inválida' });
		const tarefas = tarefaModel.listar();
		const base = coluna ? tarefas.filter(tarefa => tarefa.coluna === coluna) : tarefas;
		const porColuna = {
			afazer: base.filter(tarefa => tarefa.coluna === 'afazer').length,
			andamento: base.filter(tarefa => tarefa.coluna === 'andamento').length,
			concluido: base.filter(tarefa => tarefa.coluna === 'concluido').length,
		};
		const porPrioridade = {
			alta: base.filter(tarefa => tarefa.prioridade === 'alta').length,
			media: base.filter(tarefa => tarefa.prioridade === 'media').length,
			baixa: base.filter(tarefa => tarefa.prioridade === 'baixa').length,
		};
		res.json({ coluna: coluna || 'todas', total: base.length, porColuna, porPrioridade });
	},

	resumo(req, res) {
		const tarefas = tarefaModel.listar();
		const concluido = tarefas.filter(tarefa => tarefa.coluna === 'concluido').length;
		const andamento = tarefas.filter(tarefa => tarefa.coluna === 'andamento').length;
		const afazer = tarefas.filter(tarefa => tarefa.coluna === 'afazer').length;
		res.json({
			resumo: `Você tem ${tarefas.length} tarefas. ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer.`,
		});
	},
};

module.exports = tarefasController;