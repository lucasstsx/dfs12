import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  // Recebe email e senha, valida as credenciais e retorna um JWT
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const token = await AuthService.login(email, senha);

      // Credenciais inválidas — não revelar se foi email ou senha que errou
      if (!token) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      return res.status(200).json({ token });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao realizar login' });
    }
  },
};
