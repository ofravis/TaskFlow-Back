function criarErro(status, mensagem, detalhes) {
const erro = new Error(mensagem);
erro.status = status;
console.error('[ERRO]', req.method, req.url, erro.message);
const mensagem = status === 500 ? 'Erro interno do servidor' : erro.message;
res.status(status).json({ erro: { mensagem } });
erro.detalhes = detalhes;
return erro;
}

module.exports = criarErro;
