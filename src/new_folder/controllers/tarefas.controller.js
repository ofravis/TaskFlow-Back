const tarefaModel = require('../models/tarefa.models');
const usuarioModel = require('../models/usuario.model');
const projetoModel = require('../models/projeto.model');

const prioridadesValidas = ['alta', 'media', 'baixa'];
const colunasValidas = ['afazer', 'andamento', 'concluido'];

const idValido = (valor) => /^\d+$/.test(valor) && Number(valor) > 0;

const normalizarCep = (valor) => {
	if (valor === undefined || valor === null) return undefined;
	const cep = String(valor).replace(/\D/g, '');
	if (!/^\d{8}$/.test(cep)) return null;
	return `${cep.slice(0, 5)}-${cep.slice(5)}`;
};

const validarDados = ({ texto, prioridade, coluna, cep }, exigirTexto = false) => {
	if (exigirTexto && (typeof texto !== 'string' || !texto.trim())) return 'Texto obrigatório';
	if (texto !== undefined && (typeof texto !== 'string' || !texto.trim())) return 'Texto inválido';
	if (prioridade !== undefined && !prioridadesValidas.includes(prioridade)) return 'Prioridade inválida. Use: alta, media ou baixa';
	if (coluna !== undefined && !colunasValidas.includes(coluna)) return 'Coluna inválida. Use: afazer, andamento ou concluido';
	if (cep !== undefined) {
		const cepNormalizado = normalizarCep(cep);
		if (cepNormalizado === null) return 'CEP inválido';
	}
	return null;
};

const buscarDadosDoCep = async (cep) => {
	if (!cep) return { cep: null, cidade: null, uf: null };
	const cepNormalizado = normalizarCep(cep);
	if (!cepNormalizado) return { cep: null, cidade: null, uf: null };

	try {
		const resposta = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepNormalizado.replace('-', '')}`);
		if (!resposta.ok) throw new Error('CEP não encontrado');
		const dados = await resposta.json();
		return {
			cep: normalizarCep(dados.cep || cepNormalizado) || cepNormalizado,
			cidade: dados.city || dados.localidade || null,
			uf: dados.state || dados.uf || null,
		};
	} catch (erro) {
		try {
			const respostaFallback = await fetch(`https://viacep.com.br/ws/${cepNormalizado.replace('-', '')}/json/`);
			const dadosFallback = await respostaFallback.json();
			if (dadosFallback.erro) throw new Error('CEP não encontrado');
			return {
				cep: normalizarCep(dadosFallback.cep || cepNormalizado) || cepNormalizado,
				cidade: dadosFallback.localidade || null,
				uf: dadosFallback.uf || null,
			};
		} catch {
			return { cep: cepNormalizado, cidade: null, uf: null };
		}
	}
};

const enriquecerTarefaComCep = async (tarefa) => {
	if (!tarefa || !tarefa.cep) {
		return { ...tarefa, cep: tarefa?.cep || null, cidade: tarefa?.cidade || null, uf: tarefa?.uf || null };
	}
	const dadosEndereco = await buscarDadosDoCep(tarefa.cep);
	return {
		...tarefa,
		cep: dadosEndereco.cep || tarefa.cep,
		cidade: tarefa.cidade || dadosEndereco.cidade,
		uf: tarefa.uf || dadosEndereco.uf,
	};
};

const tarefasController = {
	async listar(req, res) {
		const { coluna, prioridade, usuarioId } = req.query;
		if (coluna && !colunasValidas.includes(coluna)) return res.status(400).json({ erro: 'Coluna inválida' });
		if (prioridade && !prioridadesValidas.includes(prioridade)) return res.status(400).json({ erro: 'Prioridade inválida' });

		let resultado = tarefaModel.listar();
		if (coluna) resultado = resultado.filter(tarefa => tarefa.coluna === coluna);
		if (prioridade) resultado = resultado.filter(tarefa => tarefa.prioridade === prioridade);
		if (usuarioId !== undefined) resultado = resultado.filter(tarefa => tarefa.usuarioId === Number(usuarioId));
		res.json(await Promise.all(resultado.map(enriquecerTarefaComCep)));
	},

	async buscarPorId(req, res) {
		if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
		const tarefa = tarefaModel.buscar(Number(req.params.id));
		if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		res.json(await enriquecerTarefaComCep(tarefa));
	},

	async criar(req, res) {
		const erro = validarDados(req.body, true);
		if (erro) return res.status(400).json({ erro });
		if (req.body.usuarioId !== undefined && !usuarioModel.buscar(Number(req.body.usuarioId))) {
			return res.status(400).json({ erro: 'Usuário não encontrado' });
		}
		if (req.body.projetoId !== undefined && !projetoModel.buscar(Number(req.body.projetoId))) {
			return res.status(400).json({ erro: 'Projeto não encontrado' });
		}
		if (req.body.coluna === 'andamento' && req.body.usuarioId !== undefined &&
			tarefaModel.listarPorUsuario(Number(req.body.usuarioId)).filter(tarefa => tarefa.coluna === 'andamento').length >= 2) {
			return res.status(400).json({ erro: 'Limite de 2 tarefas em andamento por usuário atingido' });
		}

		const cep = normalizarCep(req.body.cep);
		const novaTarefa = tarefaModel.adicionar({
			texto: req.body.texto.trim(),
			prioridade: req.body.prioridade,
			coluna: req.body.coluna,
			usuarioId: req.body.usuarioId === undefined ? undefined : Number(req.body.usuarioId),
			projetoId: req.body.projetoId === undefined ? undefined : Number(req.body.projetoId),
			cep,
			cidade: req.body.cidade,
			uf: req.body.uf,
		});
		res.status(201).json(await enriquecerTarefaComCep(novaTarefa));
	},

	async atualizar(req, res) {
		if (!idValido(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
		const erro = validarDados(req.body);
		if (erro) return res.status(400).json({ erro });
		const id = Number(req.params.id);
		const atual = tarefaModel.buscar(id);
		if (!atual) return res.status(404).json({ erro: 'Tarefa não encontrada' });
		if (req.body.usuarioId !== undefined && !usuarioModel.buscar(Number(req.body.usuarioId))) {
			return res.status(400).json({ erro: 'Usuário não encontrado' });
		}
		if (req.body.projetoId !== undefined && !projetoModel.buscar(Number(req.body.projetoId))) {
			return res.status(400).json({ erro: 'Projeto não encontrado' });
		}
		const usuarioId = req.body.usuarioId === undefined ? atual.usuarioId : Number(req.body.usuarioId);
		if (req.body.coluna === 'andamento' && atual.coluna !== 'andamento' && usuarioId !== undefined &&
			tarefaModel.listarPorUsuario(usuarioId).filter(tarefa => tarefa.coluna === 'andamento' && tarefa.id !== id).length >= 2) {
			return res.status(400).json({ erro: 'Limite de 2 tarefas em andamento por usuário atingido' });
		}
		const dados = {};
		for (const campo of ['texto', 'prioridade', 'coluna', 'usuarioId', 'projetoId', 'cep', 'cidade', 'uf']) {
			if (req.body[campo] !== undefined) {
				dados[campo] = campo === 'texto' ? req.body[campo].trim() : req.body[campo];
				if (campo === 'cep') dados[campo] = normalizarCep(req.body[campo]);
			}
		}
		if (dados.usuarioId !== undefined) dados.usuarioId = Number(dados.usuarioId);
		if (dados.projetoId !== undefined) dados.projetoId = Number(dados.projetoId);
		if (req.body.coluna !== undefined && req.body.coluna !== atual.coluna) {
			dados.concluidaEm = req.body.coluna === 'concluido' ? new Date().toISOString() : null;
		}

		const tarefa = tarefaModel.atualizar(id, dados);
		res.json(await enriquecerTarefaComCep(tarefa));
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
		const rankingUsuarios = usuarioModel.listar().map(usuario => ({
			usuarioId: usuario.id,
			nome: usuario.nome,
			totalTarefas: tarefas.filter(tarefa => tarefa.usuarioId === usuario.id).length,
		})).sort((a, b) => b.totalTarefas - a.totalTarefas);
		res.json({ coluna: coluna || 'todas', total: base.length, porColuna, porPrioridade, rankingUsuarios });
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