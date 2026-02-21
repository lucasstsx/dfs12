import express from 'express';
// Importa o arquivo de rotas centralizado
import routes from './routes/index.js';

const app = express();

// Middleware para que o Express entenda requisições no formato JSON
app.use(express.json());

// Registra todas as rotas sob o prefixo /api
app.use('/api', routes);

export default app;
