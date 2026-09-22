require('dotenv').config(); // Sempre no topo para carregar as variáveis de ambiente

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/new_folder/routes/auth.routes');
const tarefasRoutes = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');
const projetosRoutes = require('./src/new_folder/routes/projetos.routes');
const logger = require('./src/new_folder/middlewares/logger');

const app = express();
const PORTA = Number(process.env.PORT || process.env.PORTA || 3001);

// 1. Configuração Única do CORS (Antes das rotas)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://mytaskhub-mg0106gyf-fravis1.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Middlewares de parsing e log
app.use(express.json());
app.use(logger);

// 3. Rotas da Aplicação
app.use('/auth', authRoutes);
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

// 4. Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// 5. Inicialização do Servidor
app.listen(PORTA, () => {
  console.log('Servidor rodando na porta ' + PORTA);
});