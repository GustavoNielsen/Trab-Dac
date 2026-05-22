function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({
        message: 'O usuário não tem permissão para efetuar esta operação'
      });
    }

    next();
  };
}

module.exports = requireRole;
