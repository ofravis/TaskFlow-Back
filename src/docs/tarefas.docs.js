const paths = {
'/tarefas': {
get: {
tags: ['Tarefas'],
summary: 'Lista todas as tarefas',
responses: {
'200': { description: 'Lista de tarefas' },
    },
    },
    },
};
module.exports = { paths };