require('dotenv').config();

const express = require('express');
const criarErro = require('./src/new_folder/utils/criarErro');
const tarefasRoutes  = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');
const projetosRoutes = require('./src/new_folder/routes/projetos.routes');
const authRoutes = require('./src/new_folder/routes/auth.routes');
const logger = require('./src/new_folder/middlewares/logger');
const validarContentType = require('./src/new_folder/middlewares/validarcontenttype');
const cors = require('cors');
const autenticar = require('./src/new_folder/middlewares/autenticar');
const pool = require('./src/new_folder/database/db');
const tratarErros = require('./src/new_folder/middlewares/erro.middleware');
const prioridadesRoutes = require('./src/new_folder/routes/prioridade.routes');

const swaggerUi = require('swagger-ui-express');

const openapi = require('./src/docs/openapi');


const app   = express();
const PORTA = process.env.PORTA || 3001;

// ── Middlewares globais — sempre antes das rotas ────────────────────────────
app.use(cors({
  origin:         process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge:         86400,
}));
app.use(express.json());
app.use(validarContentType);
app.use(logger);

// ── Testando conexão com o banco de dados ────────────────────────────
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Erro ao conectar:', err.message);
  else     console.log('Banco conectado:', res.rows[0].now);
});

// ── Rota raiz ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// ── Rotas dos recursos ──────────────────────────────────────────────────────
app.use('/tarefas', autenticar, tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);
app.use('/auth', authRoutes);
app.use('/prioridades', autenticar,prioridadesRoutes);


app.get('/docs.json', (req, res) => res.json(openapi));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use((req, res) => {
  throw criarErro(404, 'Rota não encontrada');
});

app.use(tratarErros);

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});