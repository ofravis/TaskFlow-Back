require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/new_folder/routes/auth.routes');
const tarefasRoutes = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');
const projetosRoutes = require('./src/new_folder/routes/projetos.routes');
const logger = require('./src/new_folder/middlewares/logger');
const corsMiddleware = require('./src/new_folder/middlewares/cors');

const app = express();
const PORTA = Number(process.env.PORT || process.env.PORTA || 3001);

app.use(express.json());
app.use(logger);
app.use(corsMiddleware);

app.use('/auth', authRoutes);
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(cors({
origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));

app.listen(PORTA, () => {
console.log('Servidor na porta ' + PORTA);
});