import jwt from 'jsonwebtoken';

// Middleware que valida o token JWT e injeta req.pessoaId nas rotas protegidas
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Disponibiliza o ID e o status de admin da pessoa autenticada para os controllers
    req.pessoaId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
