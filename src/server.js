// Carrega as variáveis de ambiente do arquivo .env
import 'dotenv/config';
// Importa a instância configurada do aplicativo Express
import app from './app.js';

// Define a porta do servidor, priorizando a variável de ambiente PORT
const PORT = process.env.PORT || 3000;

// Inicia o servidor para escutar requisições na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
