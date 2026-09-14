function validar(schema) {
    return function(req, res, next) {
        const erros = [];

        for (const campo in schema) {
            const regras = schema[campo];
            const valor = req.body?.[campo];
            const ausente = valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '');

            if (regras.obrigatorio && ausente) {
                erros.push(`O campo '${campo}' é obrigatório`);
                continue;
            }

            if (valor === undefined || valor === null) {
                continue;
            }

            if (regras.type && typeof valor !== regras.type) {
                erros.push(`O campo '${campo}' deve ser do tipo ${regras.type}`);
                continue;
            }

            if (regras.type === 'string' && regras.minLength && valor.trim().length < regras.minLength) {
                erros.push(`O campo '${campo}' deve ter ao menos ${regras.minLength} caracteres`);
            }

            if (regras.type === 'string' && regras.maxLength && valor.length > regras.maxLength) {
                erros.push(`O campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres`);
            }

            if (regras.enum && !regras.enum.includes(valor)) {
                erros.push(`O campo '${campo}' deve ser um dos valores: ${regras.enum.join(', ')}`);
            }

            if (regras.formato === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                erros.push(`O campo '${campo}' deve ser um email válido`);
            }
        }

        if (erros.length > 0) {
            return res.status(400).json({ erros });
        }

        return next();
    };
}

module.exports = validar;

