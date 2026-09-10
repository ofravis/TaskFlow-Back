function middlewareFixo(req, res, next) {

next();

}
app.use(middlewareFixo);



function criarMiddleware(configuracao) {
return function(req, res, next) {
if (configuracao.bloquear) {
return res.status(403).json({ erro: 'Bloqueado' });
}
next();
};
}

app.use('/admin', criarMiddleware({ bloquear: false }));
app.use('/restrito', criarMiddleware({ bloquear: true }));

function validar(schema) { 
return function(req, res, next) { 
const erros = []; 

if (erros.length > 0) {
return res.status(400).json({ erros });

}
next();
};
}



function validar(schema) {
return function(req, res, next) {
const erros = [];
for (const campo in schema) {
const regras = schema[campo];
const valor = req.body[campo];
const ausente = valor === undefined || valor === null || valor === '';


if (regras.obrigatorio && ausente) {
erros.push(`O campo '${campo}' é obrigatório`);
continue;


};
    };
    if (!ausente && regras.tipo && typeof valor !== regras.tipo) {
erros.push(

`O campo '${campo}' deve ser do tipo ${regras.tipo}`
);
        }   
    }
if (erros.length > 0)
return res.status(400).json({ erros });
next();
};


module.exports = validar;
module.exports = validar;

