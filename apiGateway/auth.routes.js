const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middlewares/auth.middleware');
const tokenBlacklist = require('../security/token-blacklist');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/auth/login`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    tokenBlacklist.liberarUsuario(response.data?.usuario?.cpf);

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    next(error);
  }
});

router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    tokenBlacklist.invalidar(req.headers.authorization);
    tokenBlacklist.invalidar(req.token);
    tokenBlacklist.invalidarUsuario(req.user.cpf);

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    next(error);
  }
});

module.exports = router;
