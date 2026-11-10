const prisma = require('../database/prisma');

module.exports = {
  listar: async () => {
    const resultado = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    return resultado;
  },

  buscar: async (id) => {
    const resultado = await prisma.usuarios.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return resultado || null; // null = não existe → controller lança 404
  },

  buscarPorEmail: async (email) => {
    const resultado = await prisma.usuarios.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        nome: true,
        email: true,
        senha_hash: true
      }
    });
    return resultado || null; // null = não existe → controller lança 404
  },

  adicionar: async ({ nome, email, senha }) => {
    const resultado = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha_hash: senha
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return resultado;
  },

  atualizar: async (id, dados) => {
    const resultado = await prisma.usuarios.update({
      where: {
        id: id
      },
      data: {
        nome: dados.nome || undefined,
        email: dados.email || undefined,
        senha_hash: dados.senha || undefined
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return resultado || null;
  },

  remover: async (id) => {
    const resultado = await prisma.usuarios.delete({
      where: {
        id: id
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return resultado || null;
  },
};