const schemas = {
    tarefa: {
        texto: { obrigatorio: true, type: 'string' },
        prioridade: { obrigatorio: false, type: 'string', enum: ['baixa', 'media', 'alta'] },
        coluna: { obrigatorio: true, type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
        usuarioId: { obrigatorio: false, type: 'number' },
        projetoId: { obrigatorio: false, type: 'number' },
        cep: { obrigatorio: false, type: 'string', minLength: 8, maxLength: 9 }
    },

    tarefaEdicao: {
        texto: { obrigatorio: false, type: 'string' },
        prioridade: { obrigatorio: false, type: 'string', enum: ['baixa', 'media', 'alta'] },
        coluna: { obrigatorio: false, type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
        usuarioId: { obrigatorio: false, type: 'number' },
        projetoId: { obrigatorio: false, type: 'number' },
        cep: { obrigatorio: false, type: 'string', minLength: 8, maxLength: 9 }
    },

    usuario: {
        nome: { obrigatorio: true, type: 'string', minLength: 3 },
        email: { obrigatorio: true, type: 'string', formato: 'email' },
        senha: { obrigatorio: true, type: 'string', minLength: 6 },
    },

    projeto: {
        nome: { obrigatorio: true, type: 'string' },
        descricao: { obrigatorio: false, type: 'string', maxLength: 200 },
    },
};  

module.exports = schemas;