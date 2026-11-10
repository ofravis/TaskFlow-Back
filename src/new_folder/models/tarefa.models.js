const prisma = require('../database/prisma');

const tarefaJoin = {
  prioridades: { select: { descricao: true, cor: true } },
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
};

function formatarTarefa(tarefa) {
  const { projetos, usuarios, prioridades, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?.descricao,
    prioridade_cor: prioridades?.cor,
  };
}

async function buscarTarefa(id) {
  return prisma.tarefas.findUnique({
    where: { id },
    include: tarefaJoin,
  });
}

const tarefaModel = {
  listar: async () => {
    const tarefas = await prisma.tarefas.findMany({
      include: tarefaJoin,
      orderBy: { id: 'asc' },
    });
    return tarefas.map(formatarTarefa);
  },

  buscar: async (id) => {
    const tarefa = await buscarTarefa(id);
    return tarefa ? formatarTarefa(tarefa) : null;
  },

  listarPorColuna: (coluna) => prisma.tarefas.findMany({
    where: { coluna },
    orderBy: { id: 'asc' },
  }),

  listarPorUsuario: (usuarioId) => prisma.tarefas.findMany({
    where: { usuario_id: usuarioId },
    orderBy: { id: 'asc' },
  }),

  listarPorProjeto: (projetoId) => prisma.tarefas.findMany({
    where: { projeto_id: projetoId },
    orderBy: { id: 'asc' },
  }),

  contarEmAndamentoPorUsuario: async (usuarioId, excluirId) => prisma.tarefas.count({
    where: {
      usuario_id: usuarioId,
      coluna: 'andamento',
      ...(excluirId !== undefined && { id: { not: excluirId } }),
    },
  }),

  contarPorProjeto: (projetoId) => prisma.tarefas.count({
    where: { projeto_id: projetoId },
  }),

  contarPorUsuario: (usuarioId) => prisma.tarefas.count({
    where: { usuario_id: usuarioId },
  }),

  totalPorColuna: async (lista) => ({
    afazer: lista.filter(tarefa => tarefa.coluna === 'afazer').length,
    andamento: lista.filter(tarefa => tarefa.coluna === 'andamento').length,
    concluido: lista.filter(tarefa => tarefa.coluna === 'concluido').length,
  }),

  estatisticas: async (filtroColuna) => {
    const tarefas = await prisma.tarefas.findMany({
      where: filtroColuna ? { coluna: filtroColuna } : undefined,
      select: { coluna: true },
    });

    const porColuna = { afazer: 0, andamento: 0, concluido: 0 };
    for (const tarefa of tarefas) {
      if (Object.hasOwn(porColuna, tarefa.coluna)) porColuna[tarefa.coluna] += 1;
    }

    return { total: tarefas.length, porColuna };
  },

  resumo: async () => {
    const tarefas = await prisma.tarefas.findMany({
      include: { prioridades: { select: { descricao: true } } },
    });
    const totais = { afazer: 0, andamento: 0, concluido: 0 };
    const prioridades = new Map();

    for (const tarefa of tarefas) {
      if (Object.hasOwn(totais, tarefa.coluna)) totais[tarefa.coluna] += 1;
      const descricao = tarefa.prioridades?.descricao;
      if (descricao) prioridades.set(descricao, (prioridades.get(descricao) || 0) + 1);
    }

    const prioridadeDestaque = [...prioridades.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'nenhuma';

    return `Você tem ${tarefas.length} tarefas. ${totais.concluido} concluída(s), ${totais.andamento} em andamento e ${totais.afazer} a fazer. Prioridade mais comum: ${prioridadeDestaque}.`;
  },

  adicionar: async ({ texto, idprioridade, coluna, usuario_id, projeto_id, ordem }) => {
    const tarefa = await prisma.tarefas.create({
      data: {
        texto,
        idprioridade,
        coluna: coluna || 'afazer',
        usuario_id,
        projeto_id,
        ordem: ordem || 0,
      },
      include: tarefaJoin,
    });
    return formatarTarefa(tarefa);
  },

  atualizar: async (id, dados) => {
    const tarefaAtual = await prisma.tarefas.findUnique({ where: { id } });
    if (!tarefaAtual) return null;

    const data = {};
    if (dados.texto !== undefined) data.texto = dados.texto;
    if (dados.coluna !== undefined) data.coluna = dados.coluna;
    if (dados.usuario_id !== undefined) data.usuario_id = dados.usuario_id;
    if (dados.projeto_id !== undefined) data.projeto_id = dados.projeto_id;
    if (dados.idprioridade !== undefined) data.idprioridade = dados.idprioridade;
    if (dados.ordem !== undefined) data.ordem = dados.ordem;

    if (dados.coluna !== undefined && dados.coluna !== tarefaAtual.coluna) {
      data.concluida_em = dados.coluna === 'concluido' ? new Date() : null;

      if (tarefaAtual.coluna === 'afazer' && dados.coluna === 'andamento') {
        data.iniciada_em = new Date();
      } else if (dados.coluna === 'afazer') {
        data.iniciada_em = null;
      }
    }

    const tarefa = await prisma.tarefas.update({
      where: { id },
      data,
      include: tarefaJoin,
    });
    return formatarTarefa(tarefa);
  },

  remover: async (id) => {
    try {
      const tarefa = await prisma.tarefas.delete({ where: { id } });
      return formatarTarefa(tarefa);
    } catch (error) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  },
};

module.exports = tarefaModel;
