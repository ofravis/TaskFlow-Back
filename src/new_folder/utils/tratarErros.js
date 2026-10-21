function tratarErros(erro, req, res, next) {
    const status = Number.isInteger(erro?.status) && erro.status >= 400 ? erro.status : 500;
    const mensagem = erro?.message || 'Erro interno do servidor';

    if (status >= 500) {
        console.error('[ERRO]', req.method, req.originalUrl || req.url, mensagem, erro?.stack || '');
    }

    res.status(status).json({
        erro: {
            mensagem,
            ...(process.env.NODE_ENV !== 'production' && erro?.detalhes ? { detalhes: erro.detalhes } : {}),
        },
    });
}

module.exports = tratarErros;
