const normalizarTipo = (tipo) => {
    if (!tipo) return null;
    if (tipo === 'integer' || tipo === 'inteiro') return 'number';
    return tipo;
};

function validar(schema, origem = 'body') {
    return function (req, res, next) {
        const dados = req[origem] || {};
        const erros = [];

        for (const campo in schema) {
            const regras = schema[campo] || {};
            const tipo = regras.type || regras.tipo || null;
            const valor = dados[campo];
            const valorTexto = typeof valor === 'string' ? valor.trim() : valor;
            const ausente = valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '');

            if (regras.obrigatorio && ausente) {
                erros.push(`O campo '${campo}' é obrigatório`);
                continue;
            }

            if (ausente) {
                continue;
            }

            if (tipo) {
                const tipoNormalizado = normalizarTipo(tipo);
                const tipoValido = tipoNormalizado === 'number'
                    ? (typeof valor === 'number' && Number.isFinite(valor))
                    : typeof valor === tipoNormalizado;

                if (tipo === 'integer' || tipo === 'inteiro') {
                    if (!Number.isInteger(Number(valor))) {
                        erros.push(`O campo '${campo}' deve ser um inteiro válido`);
                        continue;
                    }
                } else if (!tipoValido) {
                    erros.push(`O campo '${campo}' deve ser do tipo ${tipoNormalizado}`);
                    continue;
                }
            }

            if (tipo === 'string' || regras.type === 'string') {
                if (regras.minLength && valorTexto.length < regras.minLength) {
                    erros.push(`O campo '${campo}' deve ter ao menos ${regras.minLength} caracteres`);
                }
                if (regras.maxLength && valorTexto.length > regras.maxLength) {
                    erros.push(`O campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres`);
                }
            }

            if (regras.enum && !regras.enum.includes(valor)) {
                erros.push(`O campo '${campo}' deve ser um dos valores: ${regras.enum.join(', ')}`);
            }

            if (regras.formato === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim())) {
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
