const express = require('express');

const tarefasRoutes = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');
const projetosRoutes = require('./src/new_folder/routes/projetos.routes');
const logger = require('./src/new_folder/middlewares/logger');
const corsMiddleware = require('./src/new_folder/middlewares/cors');

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(corsMiddleware);

app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});