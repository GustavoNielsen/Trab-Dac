const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../token-blacklist');
const { getJwtSecret } = require('../config/jwt');

function normalizarTipo(tipo) {
  if (tipo === 'ADMINISTRADOR') return 'ADMIN';
  return tipo;
}

function extrairToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const header = authorizationHeader.trim();

  if (/^Bearer\s+/i.test(header)) {
    return header.replace(/^Bearer\s+/i, '').trim();
  }

  return header;
}

function authMiddleware(req, res, next) {
  const token = extrairToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  if (tokenBlacklist.estaInvalidado(token)) {
    return res.status(401).json({ message: 'Token invalidado por logout.' });
  }

  jwt.verify(token, getJwtSecret(), (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    if (tokenBlacklist.usuarioInvalidado(decoded.cpf)) {
      return res.status(401).json({ message: 'Sessão do usuário invalidada.' });
    }

    req.token = token;
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
