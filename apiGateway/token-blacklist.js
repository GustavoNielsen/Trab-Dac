const tokensInvalidos = new Set();
const usuariosInvalidos = new Set();

function normalizar(token) {
  if (!token) {
    return '';
  }

  return String(token).replace(/^Bearer\s+/i, '').trim();
}

function invalidar(token) {
  const tokenNormalizado = normalizar(token);

  if (tokenNormalizado) {
    tokensInvalidos.add(tokenNormalizado);
  }
}

function estaInvalidado(token) {
  const tokenNormalizado = normalizar(token);
  return tokensInvalidos.has(tokenNormalizado);
}

function invalidarUsuario(cpf) {
  if (cpf) {
    usuariosInvalidos.add(String(cpf));
  }
}

function liberarUsuario(cpf) {
  if (cpf) {
    usuariosInvalidos.delete(String(cpf));
  }
}

function usuarioInvalidado(cpf) {
  return cpf ? usuariosInvalidos.has(String(cpf)) : false;
}

function limpar() {
  tokensInvalidos.clear();
  usuariosInvalidos.clear();
}

module.exports = {
  invalidar,
  estaInvalidado,
  invalidarUsuario,
  liberarUsuario,
  usuarioInvalidado,
  limpar
};
