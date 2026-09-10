const schemas = {
    tarefa: {
        texto: { obrigatorio: true, type: 'string' },
        prioridade: { obrigatorio: false, type: 'string', enum: ['baixa', 'media', 'alta'] },
        coluna: { obrigatorio: true, type: 'string', enum: ['afazer', 'andamento', 'concluido'] },
        usuarioId: { obrigatorio: false, type: 'number' }
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