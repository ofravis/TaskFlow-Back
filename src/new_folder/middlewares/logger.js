function logger(req, res, next) {
  const inicio  = Date.now();
  const metodo  = req.method;
  const url     = req.originalUrl || req.url;

  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    console.log(`[TEMPO] ${metodo} ${url} — ${duracao}ms`);
  });

  next();
}

module.exports = logger;