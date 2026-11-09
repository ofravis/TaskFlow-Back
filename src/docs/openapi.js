const tarefas = require('./tarefas.docs');
const recursos = require('./recursos.docs');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'API do TaskFlow',
  },
  servers: [
    { url: '/', description: 'Servidor atual' },
  ],
  tags: [
    { name: 'API' },
    { name: 'Autenticacao' },
    { name: 'Usuarios' },
    { name: 'Projetos' },
    { name: 'Tarefas' },
    { name: 'Prioridades' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['API'],
        summary: 'Verifica se a API está disponível',
        responses: {
          '200': {
            description: 'API disponível',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { mensagem: { type: 'string', example: 'TaskFlow API funcionando!' } },
                },
              },
            },
          },
        },
      },
    },
    ...tarefas.paths,
    ...recursos.paths,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Faça login em /auth/login e informe o token retornado.',
      },
    },
    schemas: {
      ...tarefas.schemas,
      ...recursos.schemas,
    },
  },
};
