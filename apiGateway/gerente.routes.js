const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

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

router.get('/gerentes', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    if (req.query.numero === 'dashboard') {
      const [gerentesResp, dashboardResp] = await Promise.all([
        axios.get(`${process.env.GERENTE_SERVICE_URL}/gerentes`, {
          headers: buildHeaders(req)
        }),
        axios.get(`${process.env.CONTA_SERVICE_URL}/internal/contas/dashboard/gerentes`, {
          headers: buildHeaders(req)
        })
      ]);

      const gerentesPorCpf = new Map(
        gerentesResp.data.map((g) => [g.cpf, g])
      );

      const composicao = dashboardResp.data
        .map((item) => ({
          gerente: gerentesPorCpf.get(item.gerenteCpf),
          clientes: item.clientes,
          saldo_positivo: item.saldoPositivo,
          saldo_negativo: item.saldoNegativo
        }))
        .sort((a, b) => Number(b.saldo_positivo) - Number(a.saldo_positivo));

      return res.json(composicao);
    }

    const response = await axios.get(
      `${process.env.GERENTE_SERVICE_URL}/gerentes`,
      {
        params: req.query,
        headers: buildHeaders(req)
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.post('/gerentes', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.SAGA_SERVICE_URL}/gerentes`,
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
      if (error.response.data) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.put('/gerentes/:cpf', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const response = await axios.put(
      `${process.env.SAGA_SERVICE_URL}/gerentes/${req.params.cpf}`,
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
      if (error.response.data) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.delete('/gerentes/:cpf', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const response = await axios.delete(
      `${process.env.SAGA_SERVICE_URL}/gerentes/${req.params.cpf}`,
      {
        headers: buildHeaders(req)
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

router.get('/gerentes/:cpf', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.GERENTE_SERVICE_URL}/gerentes/${req.params.cpf}`,
      {
        headers: buildHeaders(req)
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.data) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(error.response.status).send();
    }
    next(error);
  }
});

module.exports = router;
