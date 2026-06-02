const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../token-blacklist');

function normalizarTipo(tipo) {
  if (tipo === 'ADMINISTRADOR') return 'ADMIN';
  return tipo;
}

function authMiddleware(req, res, next) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const token = tokenHeader.split(' ')[1];

  if (tokenBlacklist.estaInvalidado(token)) {
    return res.status(401).json({ message: 'Token invalidado por logout.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    if (tokenBlacklist.usuarioInvalidado(decoded.cpf)) {
      return res.status(401).json({ message: 'Sessão do usuário invalidada.' });
    }

    req.user = {
      sub: decoded.sub,
      email: decoded.sub,
      cpf: decoded.cpf,
      tipo: normalizarTipo(decoded.perfil),
      perfil: decoded.perfil
    };

    next();
  });
}

module.exports = authMiddleware;
