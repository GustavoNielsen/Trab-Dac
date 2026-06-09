/** Mesma chave do ms-autenticador: Base64 decodificado antes do HMAC. */
function getJwtSecret() {
  const raw = process.env.JWT_SECRET;

  if (!raw) {
    throw new Error('JWT_SECRET não configurado no .env do gateway');
  }

  return Buffer.from(raw, 'base64');
}

module.exports = { getJwtSecret };
