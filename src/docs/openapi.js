const tarefas = require('./tarefas.docs');
module.exports = {
openapi: '3.0.3',
info: {
title: 'TaskFlow API',
version: '1.0.0',
description: 'API do TaskFlow · SENAI CTGAS-ER · Programador Full Stack',
},
servers: [
{ url: 'http://localhost:3001', description: 'Local' },
],
paths: {
...tarefas.paths,
},
components: {
schemas: {
...tarefas.schemas,
},
},
};


const tarefasDocs = require('./tarefas.docs');

module.exports = {
openapi: '3.0.3',
info: {
title: 'TaskFlow API',
version: '1.0.0',
description: 'TaskFlowHub API',
},
servers: [{ url: 'http://localhost:3001', description: 'Local' }],
paths: tarefasDocs.paths,
};
