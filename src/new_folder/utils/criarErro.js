function criarErro(status, mensagem, detalhes) {
    const erro = new Error(mensagem);
    erro.status = status;
    erro.detalhes = detalhes;
    return erro;
}

module.exports = criarErro;
