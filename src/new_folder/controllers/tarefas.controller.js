let tarefas = [];
let proximoId = 1;

const tarefasController = {
	listar(req, res) {
		const { coluna, prioridade } = req.query;
		let resultado = tarefas;
		if (coluna) resultado = resultado.filter(tarefa => tarefa.coluna === coluna);
		if (prioridade) resultado = resultado.filter(tarefa => tarefa.prioridade === prioridade);
		res.json(resultado);
	},

	buscarPorId(req, res) {
		const id = parseInt(req.params.id, 10);
		const tarefa = tarefas.find(item => item.id === id);
		if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		res.json(tarefa);
	},

	criar(req, res) {
		const { texto, prioridade, coluna } = req.body;
		if (!texto) return res.status(400).json({ erro: 'Texto obrigatório' });

		const novaTarefa = {
			id: proximoId++,
			texto,
			prioridade: prioridade || 'media',
			coluna: coluna || 'afazer',
		};
		tarefas.push(novaTarefa);
		res.status(201).json(novaTarefa);
	},

	atualizar(req, res) {
		const id = parseInt(req.params.id, 10);
		const indice = tarefas.findIndex(tarefa => tarefa.id === id);
		if (indice === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

		tarefas[indice] = { ...tarefas[indice], ...req.body, id };
		res.json(tarefas[indice]);
	},

	remover(req, res) {
		const id = parseInt(req.params.id, 10);
		const indice = tarefas.findIndex(tarefa => tarefa.id === id);
		if (indice === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

		const tarefaRemovida = tarefas.splice(indice, 1)[0];
		res.json({ mensagem: 'Tarefa removida', tarefa: tarefaRemovida });
	},

	estatisticas(req, res) {
		const { coluna } = req.query;
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
		const concluido = tarefas.filter(tarefa => tarefa.coluna === 'concluido').length;
		const andamento = tarefas.filter(tarefa => tarefa.coluna === 'andamento').length;
		const afazer = tarefas.filter(tarefa => tarefa.coluna === 'afazer').length;
		res.json({
			resumo: `Você tem ${tarefas.length} tarefas. ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer.`,
		});
	},
};

module.exports = tarefasController;