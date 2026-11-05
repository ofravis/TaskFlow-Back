// src/docs/tarefas.docs.js
// Documentação das rotas de tarefas: paths e schemas deste recurso

const { json, jsonLista, parametroId } = require('./comum');

const paths = {
  '/tarefas': {
    get: {
      tags: ['Tarefas'],
      summary: 'Lista todas as tarefas',
      parameters: [
        {
          name: 'coluna',
          in: 'query',
          required: false,
          description: 'Filtra pela coluna do Kanban',
          schema: { type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
        },
      ],
      responses: {
        '200': {
          description: 'Lista de tarefas',
          content: jsonLista('Tarefa'),
        //   content: {
        //     'application/json': {
        //       schema: { type: 'array', items: { $ref: '#/components/schemas/Tarefa' } },
        //     },
        //   },
        },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
      },
    },
    post: {
      tags: ['Tarefas'],
      summary: 'Cria uma tarefa',
      requestBody: { required: true, content: json('TarefaEntrada') },
      responses: {
        '201': { description: 'Tarefa criada', content: json('Tarefa') },
        '400': { description: 'Dados inválidos ou id relacionado inexistente', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
      },
    },
  },

  '/tarefas/{id}': {
    get: {
      tags: ['Tarefas'],
      summary: 'Busca uma tarefa pelo id',
      parameters: [parametroId],
      responses: {
        '200': { description: 'Tarefa encontrada', content: json('Tarefa') },
        '400': { description: 'Id inválido', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Tarefa não encontrada', content: json('Erro') },
      },
    },
    put: {
      tags: ['Tarefas'],
      summary: 'Atualiza uma tarefa',
      parameters: [parametroId],
      requestBody: { required: true, content: json('TarefaEntrada') },
      responses: {
        '200': { description: 'Tarefa atualizada', content: json('Tarefa') },
        '400': { description: 'Dados inválidos', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Tarefa não encontrada', content: json('Erro') },
      },
    },
    delete: {
      tags: ['Tarefas'],
      summary: 'Exclui uma tarefa',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Tarefa excluída',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensagem: { type: 'string', example: 'Tarefa removida' },
                  tarefa: { $ref: '#/components/schemas/Tarefa' },
                },
              },
            },
          },
        },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Tarefa não encontrada', content: json('Erro') },
      },
    },
  },
};

const schemas = {
  // O que a API DEVOLVE
  Tarefa: {
    type: 'object',
    properties: {
      id:             { type: 'integer', example: 1 },
      texto:          { type: 'string', example: 'Definir tabelas do banco' },
      coluna:         { type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
      ordem:          { type: 'integer', example: 0 },
      usuario_id:     { type: 'integer', example: 1 },
      projeto_id:     { type: 'integer', example: 1 },
      idprioridade:   { type: 'integer', example: 2 },
      criado_em:      { type: 'string', format: 'date-time' },
      iniciada_em:    { type: 'string', format: 'date-time', nullable: true },
      concluida_em:   { type: 'string', format: 'date-time', nullable: true },
      projeto:        { type: 'string', example: 'TaskFlow' },
      usuario:        { type: 'string', example: 'Ana Lima' },
      prioridade:     { type: 'string', example: 'Médio' },
      prioridade_cor: { type: 'string', example: '#F5A623' },
    },
  },
  // O que o cliente ENVIA no POST e no PUT
  TarefaEntrada: {
    type: 'object',
    required: ['texto', 'coluna', 'usuario_id', 'projeto_id', 'idprioridade'],
    properties: {
      texto:        { type: 'string', example: 'Revisar layout' },
      coluna:       { type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
      usuario_id:   { type: 'integer', example: 1 },
      projeto_id:   { type: 'integer', example: 1 },
      idprioridade: { type: 'integer', example: 2 },
      ordem:        { type: 'integer', example: 0 },
    },
  },
};

module.exports = { paths, schemas };