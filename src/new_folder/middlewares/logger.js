function logger(req, res, next) {
    const agora = new Date().toISOString();
    const metodo = req.method;
    const url = req.originalUrl; || req.url;


    const ipBruto = req.ip 