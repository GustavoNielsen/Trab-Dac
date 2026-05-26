const express = require('express');
const axios = require('axios');
const authMiddleware = require('./middlewares/auth.middleware');
const requireRole = require('./middlewares/role.middleware');

const router = express.Router();

function buildHeaders(req) {
  return {
    Authorization: req.headers.authorization,
    'x-user-id': req.user.sub,
    'x-user-email': req.user.email,
    'x-user-cpf': req.user.cpf,
    'x-user-tipo': req.user.tipo
  };
}

router.get(
  '/contas/:numero/saldo',
  authMiddleware,
  requireRole('CLIENTE', 'GERENTE', 'ADMIN'),
  async (req, res, next) => {
    try {
      const response = await axios.get(
        `${process.env.CONTA_SERVICE_URL}/contas/${req.params.numero}/saldo`,
        {
          headers: buildHeaders(req)
        }
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.data) return res.status(error.response.status).json(error.response.data);
        return res.status(error.response.status).send();
      }
      next(error);
    }
  }
);

router.post('/contas/:numero/depositar', authMiddleware, requireRole('CLIENTE'), async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.CONTA_SERVICE_URL}/contas/${req.params.numero}/depositar`,
      req.body,
      {
        headers: {
          ...buildHeaders(req),
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) return res.status(error.response.status).json(error.response.data);
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.post('/contas/:numero/sacar', authMiddleware, requireRole('CLIENTE'), async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.CONTA_SERVICE_URL}/contas/${req.params.numero}/sacar`,
      req.body,
      {
        headers: {
          ...buildHeaders(req),
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) return res.status(error.response.status).json(error.response.data);
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.post('/contas/:numero/transferir', authMiddleware, requireRole('CLIENTE'), async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.CONTA_SERVICE_URL}/contas/${req.params.numero}/transferir`,
      req.body,
      {
        headers: {
          ...buildHeaders(req),
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) return res.status(error.response.status).json(error.response.data);
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.get(
  '/contas/:numero/extrato',
  authMiddleware,
  requireRole('CLIENTE', 'GERENTE', 'ADMIN'),
  async (req, res, next) => {
    try {
      const response = await axios.get(
        `${process.env.CONTA_SERVICE_URL}/contas/${req.params.numero}/extrato`,
        {
          headers: buildHeaders(req)
        }
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.data) return res.status(error.response.status).json(error.response.data);
        return res.status(error.response.status).send();
      }
      next(error);
    }
  }
);

module.exports = router;
