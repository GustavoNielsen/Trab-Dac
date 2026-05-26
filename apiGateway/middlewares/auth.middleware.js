const jwt = require('jsonwebtoken');

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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
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
