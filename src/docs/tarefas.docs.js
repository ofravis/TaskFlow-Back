const { json, jsonLista, parametroId } = require('./comum');

const bearer = [{ BearerAuth: [] }];
const erro = { description: 'Requisição inválida', content: json('Erro') };
const naoAutorizado = { description: 'Token ausente ou inválido', content: json('Erro') };
const naoEncontrado = { description: 'Tarefa não encontrada', content: json('Erro') };
const colunas = ['afazer', 'andamento', 'concluido'];
const prioridades = ['baixa', 'media', 'alta'];
const tarefaEntradaProperties = {
  texto: { type: 'string', minLength: 1, example: 'Revisar layout' },
  coluna: { type: 'string', enum: colunas },
  prioridade: { type: 'string', enum: prioridades, example: 'media' },
  usuarioId: { type: 'integer', minimum: 1 },
  projetoId: { type: 'integer', minimum: 1 },
  cep: { type: 'string', minLength: 8, maxLength: 9, example: '01310-100' },
  cidade: { type: 'string' },
  uf: { type: 'string', minLength: 2, maxLength: 2 },
};

const paths = {
  '/tarefas': {
    get: {
      tags: ['Tarefas'],
      summary: 'Lista tarefas',
      security: bearer,
      parameters: [
        {
          name: 'coluna',
          in: 'query',
          schema: { type: 'string', enum: colunas },
        },
        {
          name: 'prioridade',
          in: 'query',
          schema: { type: 'string', enum: prioridades },
        },
        {
          name: 'usuarioId',
          in: 'query',
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      responses: {
        '200': { description: 'Lista de tarefas', content: jsonLista('Tarefa') },
        '400': erro,
        '401': naoAutorizado,
      },
    },
    post: {
      tags: ['Tarefas'],
      summary: 'Cria uma tarefa',
      security: bearer,
      requestBody: {
        required: true,
        content: json('TarefaEntrada'),
      },
      responses: {
        '201': { description: 'Tarefa criada', content: json('Tarefa') },
        '400': erro,
        '401': naoAutorizado,
      },
    },
  },
  '/tarefas/estatisticas': {
    get: {
      tags: ['Tarefas'],
      summary: 'Retorna estatísticas das tarefas',
      security: bearer,
      parameters: [
        {
          name: 'coluna',
          in: 'query',
          schema: { type: 'string', enum: colunas },
        },
      ],
      responses: {
        '200': { description: 'Estatísticas das tarefas', content: json('EstatisticasTarefas') },
        '400': erro,
        '401': naoAutorizado,
      },
    },
  },
  '/tarefas/resumo': {
    get: {
      tags: ['Tarefas'],
      summary: 'Retorna um resumo textual das tarefas',
      security: bearer,
      responses: {
        '200': { description: 'Resumo das tarefas', content: json('ResumoTarefas') },
        '401': naoAutorizado,
      },
    },
  },
  '/tarefas/{id}': {
    parameters: [parametroId],
    get: {
      tags: ['Tarefas'],
      summary: 'Busca uma tarefa pelo ID',
      security: bearer,
      responses: {
        '200': { description: 'Tarefa encontrada', content: json('Tarefa') },
        '400': erro,
        '401': naoAutorizado,
        '404': naoEncontrado,
      },
    },
    put: {
      tags: ['Tarefas'],
      summary: 'Atualiza uma tarefa',
      security: bearer,
      requestBody: { required: true, content: json('TarefaAtualizacao') },
      responses: {
        '200': { description: 'Tarefa atualizada', content: json('Tarefa') },
        '400': erro,
        '401': naoAutorizado,
        '404': naoEncontrado,
      },
    },
    patch: {
      tags: ['Tarefas'],
      summary: 'Atualiza parcialmente uma tarefa',
      security: bearer,
      requestBody: { required: true, content: json('TarefaAtualizacao') },
      responses: {
        '200': { description: 'Tarefa atualizada', content: json('Tarefa') },
        '400': erro,
        '401': naoAutorizado,
        '404': naoEncontrado,
      },
    },
    delete: {
      tags: ['Tarefas'],
      summary: 'Remove uma tarefa',
      security: bearer,
      responses: {
        '200': { description: 'Tarefa removida', content: json('RemocaoTarefa') },
        '400': erro,
        '401': naoAutorizado,
        '404': naoEncontrado,
      },
    },
  },
};

const schemas = {
  Erro: {
    type: 'object',
    properties: {
      mensagem: { type: 'string' },
      erro: {
        oneOf: [
          { type: 'string' },
          {
            type: 'object',
            properties: {
              mensagem: { type: 'string' },
              detalhes: {},
            },
          },
        ],
      },
    },
  },
  Tarefa: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      texto: { type: 'string', example: 'Revisar layout' },
      coluna: { type: 'string', enum: colunas },
      ordem: { type: 'integer', example: 0 },
      usuario_id: { type: 'integer', nullable: true },
      projeto_id: { type: 'integer', nullable: true },
      idprioridade: { type: 'integer', nullable: true },
      concluida_em: { type: 'string', format: 'date-time', nullable: true },
      iniciada_em: { type: 'string', format: 'date-time', nullable: true },
      projeto: { type: 'string', nullable: true },
      usuario: { type: 'string', nullable: true },
      prioridade: { type: 'string', nullable: true },
      prioridade_cor: { type: 'string', nullable: true, example: '#F5A623' },
      cep: { type: 'string', nullable: true, example: '01310-100' },
      cidade: { type: 'string', nullable: true },
      uf: { type: 'string', nullable: true, example: 'SP' },
    },
  },
  TarefaEntrada: {
    type: 'object',
    required: ['texto', 'coluna'],
    properties: tarefaEntradaProperties,
  },
  TarefaAtualizacao: {
    type: 'object',
    properties: tarefaEntradaProperties,
  },
  EstatisticasTarefas: {
    type: 'object',
    properties: {
      coluna: { type: 'string', example: 'todas' },
      total: { type: 'integer', example: 12 },
      porColuna: {
        type: 'object',
        properties: {
          afazer: { type: 'integer' },
          andamento: { type: 'integer' },
          concluido: { type: 'integer' },
        },
      },
      porPrioridade: {
        type: 'object',
        properties: {
          alta: { type: 'integer' },
          media: { type: 'integer' },
          baixa: { type: 'integer' },
        },
      },
      rankingUsuarios: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            usuarioId: { type: 'integer' },
            nome: { type: 'string' },
            totalTarefas: { type: 'integer' },
          },
        },
      },
    },
  },
  ResumoTarefas: {
    type: 'object',
    properties: { resumo: { type: 'string' } },
  },
  RemocaoTarefa: {
    type: 'object',
    properties: {
      mensagem: { type: 'string', example: 'Tarefa removida' },
      tarefa: { $ref: '#/components/schemas/Tarefa' },
    },
  },
};

module.exports = { paths, schemas };
