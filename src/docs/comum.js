const json = (nomeSchema) => ({
  'application/json': {
    schema: { $ref: `#/components/schemas/${nomeSchema}` },
  },
});

const jsonLista = (nomeSchema) => ({
  'application/json': {
    schema: {
      type: 'array',
      items: { $ref: `#/components/schemas/${nomeSchema}` },
    },
  },
});

const parametroId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
};

module.exports = { json, jsonLista, parametroId };