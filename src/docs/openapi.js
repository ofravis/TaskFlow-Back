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
