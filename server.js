const express = require('express');

const tarefasRoutes = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');

const app = express();
const PORTA = 3000;

app.use(express.json());

app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});