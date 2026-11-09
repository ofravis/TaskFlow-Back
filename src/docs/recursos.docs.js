const { json, jsonLista, parametroId } = require('./comum');

const bearer = [{ BearerAuth: [] }];
const naoAutorizado = { description: 'Token ausente ou inválido', content: json('Erro') };
const idInvalido = { description: 'ID inválido', content: json('Erro') };

const paths = {
  '/auth/login': {
    post: {
      tags: ['Autenticacao'],
      summary: 'Autentica um usuário e retorna um token JWT',
      requestBody: {
        required: true,
        content: json('LoginEntrada'),
      },
      responses: {
        '200': { description: 'Autenticação realizada', content: json('LoginResposta') },
        '400': { description: 'Email e senha são obrigatórios', content: json('Erro') },
        '401': { description: 'Credenciais inválidas', content: json('Erro') },
      },
    },
  },
  '/usuarios': {
    post: {
      tags: ['Usuarios'],
      summary: 'Cadastra um usuário',
      requestBody: {
        required: true,
        content: json('UsuarioEntrada'),
      },
      responses: {
        '201': { description: 'Usuário criado', content: json('Usuario') },
        '400': { description: 'Dados inválidos ou email já cadastrado', content: json('Erro') },
      },
    },
    get: {
      tags: ['Usuarios'],
      summary: 'Lista usuários',
      security: bearer,
      responses: {
        '200': { description: 'Lista de usuários', content: jsonLista('Usuario') },
        '401': naoAutorizado,
      },
    },
  },
  '/usuarios/{id}': {
    parameters: [parametroId],
    get: {
      tags: ['Usuarios'],
      summary: 'Busca um usuário pelo ID',
      security: bearer,
      responses: {
        '200': { description: 'Usuário encontrado', content: json('Usuario') },
        '400': idInvalido,
        '401': naoAutorizado,
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
      },
    },
    put: {
      tags: ['Usuarios'],
      summary: 'Atualiza um usuário',
      security: bearer,
      requestBody: { required: true, content: json('UsuarioEntrada') },
      responses: {
        '200': { description: 'Usuário atualizado', content: json('Usuario') },
        '400': { description: 'Dados inválidos ou email já cadastrado', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
      },
    },
    delete: {
      tags: ['Usuarios'],
      summary: 'Remove um usuário sem tarefas associadas',
      security: bearer,
      responses: {
        '200': { description: 'Usuário removido', content: json('RemocaoUsuario') },
        '400': { description: 'ID inválido ou usuário possui tarefas', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
      },
    },
  },
  '/projetos': {
    get: {
      tags: ['Projetos'],
      summary: 'Lista projetos',
      security: bearer,
      responses: {
        '200': { description: 'Lista de projetos', content: jsonLista('Projeto') },
        '401': naoAutorizado,
      },
    },
    post: {
      tags: ['Projetos'],
      summary: 'Cria um projeto',
      security: bearer,
      requestBody: { required: true, content: json('ProjetoEntrada') },
      responses: {
        '201': { description: 'Projeto criado', content: json('Projeto') },
        '400': { description: 'Nome obrigatório', content: json('Erro') },
        '401': naoAutorizado,
      },
    },
  },
  '/projetos/{id}': {
    parameters: [parametroId],
    get: {
      tags: ['Projetos'],
      summary: 'Busca um projeto pelo ID',
      security: bearer,
      responses: {
        '200': { description: 'Projeto encontrado', content: json('Projeto') },
        '400': idInvalido,
        '401': naoAutorizado,
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },
    put: {
      tags: ['Projetos'],
      summary: 'Atualiza um projeto',
      security: bearer,
      requestBody: { required: true, content: json('ProjetoAtualizacao') },
      responses: {
        '200': { description: 'Projeto atualizado', content: json('Projeto') },
        '400': { description: 'ID ou dados inválidos', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },
    delete: {
      tags: ['Projetos'],
      summary: 'Remove um projeto sem tarefas associadas',
      security: bearer,
      responses: {
        '200': { description: 'Projeto removido', content: json('RemocaoProjeto') },
        '400': { description: 'ID inválido ou projeto possui tarefas', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },
  },
  '/projetos/{id}/resumo': {
    parameters: [parametroId],
    get: {
      tags: ['Projetos'],
      summary: 'Retorna a contagem de tarefas do projeto por coluna',
      security: bearer,
      responses: {
        '200': { description: 'Resumo do projeto', content: json('ResumoProjeto') },
        '400': idInvalido,
        '401': naoAutorizado,
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },
  },
  '/prioridades': {
    get: {
      tags: ['Prioridades'],
      summary: 'Lista prioridades',
      security: bearer,
      responses: {
        '200': { description: 'Lista de prioridades', content: jsonLista('Prioridade') },
        '401': naoAutorizado,
      },
    },
    post: {
      tags: ['Prioridades'],
      summary: 'Cria uma prioridade',
      security: bearer,
      requestBody: { required: true, content: json('PrioridadeEntrada') },
      responses: {
        '201': { description: 'Prioridade criada', content: json('Prioridade') },
        '400': { description: 'Dados inválidos', content: json('Erro') },
        '401': naoAutorizado,
      },
    },
  },
  '/prioridades/{id}': {
    parameters: [parametroId],
    get: {
      tags: ['Prioridades'],
      summary: 'Busca uma prioridade pelo ID',
      security: bearer,
      responses: {
        '200': { description: 'Prioridade encontrada', content: json('Prioridade') },
        '400': idInvalido,
        '401': naoAutorizado,
        '404': { description: 'Prioridade não encontrada', content: json('Erro') },
      },
    },
    put: {
      tags: ['Prioridades'],
      summary: 'Atualiza uma prioridade',
      security: bearer,
      requestBody: { required: true, content: json('PrioridadeAtualizacao') },
      responses: {
        '200': { description: 'Prioridade atualizada', content: json('Prioridade') },
        '400': { description: 'Dados inválidos', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Prioridade não encontrada', content: json('Erro') },
      },
    },
    delete: {
      tags: ['Prioridades'],
      summary: 'Remove uma prioridade',
      security: bearer,
      responses: {
        '204': { description: 'Prioridade removida' },
        '400': { description: 'ID inválido', content: json('Erro') },
        '401': naoAutorizado,
        '404': { description: 'Prioridade não encontrada', content: json('Erro') },
      },
    },
  },
};

const schemas = {
  LoginEntrada: {
    type: 'object',
    required: ['email', 'senha'],
    properties: {
      email: { type: 'string', format: 'email', example: 'ana@example.com' },
      senha: { type: 'string', format: 'password', example: 'senha123' },
    },
  },
  LoginResposta: {
    type: 'object',
    properties: {
      token: { type: 'string', description: 'Token JWT para usar no botão Authorize' },
      usuario: { $ref: '#/components/schemas/UsuarioResumo' },
    },
  },
  Usuario: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Ana Lima' },
      email: { type: 'string', format: 'email', example: 'ana@example.com' },
    },
  },
  UsuarioResumo: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Ana Lima' },
    },
  },
  UsuarioEntrada: {
    type: 'object',
    required: ['nome', 'email', 'senha'],
    properties: {
      nome: { type: 'string', minLength: 3, example: 'Ana Lima' },
      email: { type: 'string', format: 'email', example: 'ana@example.com' },
      senha: { type: 'string', minLength: 6, format: 'password' },
    },
  },
  RemocaoUsuario: {
    type: 'object',
    properties: {
      mensagem: { type: 'string', example: 'Usuário removido' },
      usuario: { $ref: '#/components/schemas/Usuario' },
    },
  },
  Projeto: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'TaskFlow' },
      descricao: { type: 'string', example: 'Organização de tarefas' },
    },
  },
  ProjetoEntrada: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', minLength: 1 },
      descricao: { type: 'string', maxLength: 200 },
    },
  },
  ProjetoAtualizacao: {
    type: 'object',
    properties: {
      nome: { type: 'string', minLength: 1 },
      descricao: { type: 'string', maxLength: 200 },
    },
  },
  RemocaoProjeto: {
    type: 'object',
    properties: {
      mensagem: { type: 'string', example: 'Projeto removido' },
      projeto: { $ref: '#/components/schemas/Projeto' },
    },
  },
  ResumoProjeto: {
    type: 'object',
    properties: {
      projeto: { $ref: '#/components/schemas/Projeto' },
      totalTarefas: { type: 'integer' },
      porColuna: {
        type: 'object',
        properties: {
          afazer: { type: 'integer' },
          andamento: { type: 'integer' },
          concluido: { type: 'integer' },
        },
      },
    },
  },
  Prioridade: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      descricao: { type: 'string', example: 'Alta' },
      criado_em: { type: 'string', format: 'date-time', nullable: true },
      ativo: { type: 'boolean', default: true },
      cor: { type: 'string', example: '#EF4444' },
    },
  },
  PrioridadeEntrada: {
    type: 'object',
    required: ['descricao'],
    properties: {
      descricao: { type: 'string', maxLength: 20 },
      ativo: { type: 'boolean', default: true },
      cor: { type: 'string', maxLength: 7, example: '#EF4444' },
    },
  },
  PrioridadeAtualizacao: {
    type: 'object',
    properties: {
      descricao: { type: 'string', maxLength: 20 },
      ativo: { type: 'boolean' },
      cor: { type: 'string', maxLength: 7 },
    },
  },
};

module.exports = { paths, schemas };
