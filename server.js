require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/new_folder/routes/auth.routes');
const tarefasRoutes = require('./src/new_folder/routes/tarefas.routes');
const usuariosRoutes = require('./src/new_folder/routes/usuarios.routes');
const projetosRoutes = require('./src/new_folder/routes/projetos.routes');
const logger = require('./src/new_folder/middlewares/logger');
const criarErro = require('./src/new_folder/utils/criarErro');
const tratarErros = require('./src/new_folder/utils/tratarErros');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./src/docs/openapi');

const app = express();
const PORTA = Number(process.env.PORT || process.env.PORTA || 3001);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

const envOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.CORS_ORIGINS ||
  process.env.ALLOWED_ORIGINS ||
  ''
).split(',');

const defaultOrigins = [
  'https://localhost:3001',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://mytaskhub-sooty.vercel.app',
  'https://mytaskhub-mg0106gyf-fravis1.vercel.app',
];

const allowedOrigins = [...envOrigins, ...defaultOrigins]
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`CORS bloqueado para origem: ${origin}`);
    callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

app.use((req, res, next) => {
  const rota = `${req.method} ${req.originalUrl || req.url}`;
  next(criarErro(404, `Rota não encontrada: ${rota}`));
});

app.use(tratarErros);

if (require.main === module) {
  app.listen(PORTA, () => {
    console.log('Servidor rodando na porta ' + PORTA);
  });
}

module.exports = app;