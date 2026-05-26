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

function normalizarTipo(tipo) {
  if (tipo === 'ADMINISTRADOR') return 'ADMIN';
  return tipo;
}

async function escolherGerenteMenorCarga() {
  const [gerentesResponse, cargasResponse] = await Promise.all([
    axios.get(`${process.env.GERENTE_SERVICE_URL}/gerentes`),
    axios.get(`${process.env.CLIENTE_SERVICE_URL}/internal/clientes/dashboard/gerentes`)
  ]);

  const gerentesOperacionais = gerentesResponse.data.filter(
    (gerente) => normalizarTipo(gerente.tipo) === 'GERENTE'
  );

  if (gerentesOperacionais.length === 0) {
    return null;
  }

  const cargasPorGerente = new Map(
    cargasResponse.data.map((item) => [
      item.gerenteCpf,
      Number(item.quantidadeClientes ?? 0)
    ])
  );

  return gerentesOperacionais
    .sort((a, b) => {
      const cargaA = cargasPorGerente.get(a.cpf) ?? 0;
      const cargaB = cargasPorGerente.get(b.cpf) ?? 0;

      if (cargaA !== cargaB) {
        return cargaA - cargaB;
      }

      return a.cpf.localeCompare(b.cpf);
    })[0].cpf;
}

async function validarGerenteResponsavel(req, cpfCliente) {
  const response = await axios.get(
    `${process.env.CLIENTE_SERVICE_URL}/internal/clientes/${cpfCliente}`,
    {
      headers: buildHeaders(req)
    }
  );

  return response.data.gerenteCpf === req.user.cpf;
}

function podeConsultarCliente(req, cpfConsultado) {
  const tipo = req.user.tipo;

  if (tipo === 'ADMIN' || tipo === 'ADMINISTRADOR') {
    return true;
  }

  if (tipo === 'GERENTE') {
    return true;
  }

  if (tipo === 'CLIENTE' && req.user.cpf === cpfConsultado) {
    return true;
  }

  return false;
}

async function buscarClientesComContaDoGerente(req) {
  const [clientesResponse, contasResponse] = await Promise.all([
    axios.get(
      `${process.env.CLIENTE_SERVICE_URL}/internal/clientes/gerente/${req.user.cpf}/aprovados`,
      {
        headers: buildHeaders(req)
      }
    ),
    axios.get(
      `${process.env.CONTA_SERVICE_URL}/internal/contas/gerente/${req.user.cpf}/clientes`,
      {
        headers: buildHeaders(req)
      }
    )
  ]);

  const contasPorCpf = new Map(
    contasResponse.data.map((conta) => [conta.cliente, conta])
  );

  return clientesResponse.data
    .filter((cliente) => contasPorCpf.has(cliente.cpf))
    .map((cliente) => {
      const conta = contasPorCpf.get(cliente.cpf);

      return {
        cpf: cliente.cpf,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        cidade: cliente.cidade,
        estado: cliente.estado,
        conta: conta.conta,
        saldo: conta.saldo,
        limite: conta.limite
      };
    });
}

router.get('/clientes', authMiddleware, async (req, res, next) => {
  try {
    const { filtro } = req.query;

    if (filtro === 'para_aprovar') {
      if (req.user.tipo !== 'GERENTE') {
        return res.status(403).json({
          message: 'O usuário não tem permissão para efetuar esta operação'
        });
      }

      const response = await axios.get(
        `${process.env.CLIENTE_SERVICE_URL}/clientes`,
        {
          params: { filtro },
          headers: buildHeaders(req)
        }
      );

      return res.status(response.status).json(response.data);
    }

    if (filtro === 'melhores_clientes') {
      if (req.user.tipo !== 'GERENTE') {
        return res.status(403).json({
          message: 'O usuário não tem permissão para efetuar esta operação'
        });
      }

      const composicao = await buscarClientesComContaDoGerente(req);

      const melhoresClientes = composicao
        .sort((a, b) => {
          const saldoA = Number(a.saldo);
          const saldoB = Number(b.saldo);

          if (saldoB !== saldoA) {
            return saldoB - saldoA;
          }

          return a.nome.localeCompare(b.nome, 'pt-BR');
        })
        .slice(0, 3);

      return res.status(200).json(melhoresClientes);
    }

    if (filtro === 'adm_relatorio_clientes') {
      if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'ADMINISTRADOR') {
        return res.status(403).json({
          message: 'O usuário não tem permissão para efetuar esta operação'
        });
      }

      const [clientesResponse, contasResponse, gerentesResponse] = await Promise.all([
        axios.get(
          `${process.env.CLIENTE_SERVICE_URL}/internal/clientes/aprovados`,
          {
            headers: buildHeaders(req)
          }
        ),
        axios.get(
          `${process.env.CONTA_SERVICE_URL}/internal/contas/clientes`,
          {
            headers: buildHeaders(req)
          }
        ),
        axios.get(
          `${process.env.GERENTE_SERVICE_URL}/gerentes`,
          {
            headers: buildHeaders(req)
          }
        )
      ]);

      const contasPorCpf = new Map(
        contasResponse.data.map((conta) => [conta.cliente, conta])
      );

      const gerentesPorCpf = new Map(
        gerentesResponse.data.map((gerente) => [gerente.cpf, gerente])
      );

      const composicao = clientesResponse.data
        .filter((cliente) => contasPorCpf.has(cliente.cpf))
        .map((cliente) => {
          const conta = contasPorCpf.get(cliente.cpf);
          const gerente = gerentesPorCpf.get(conta.gerente);

          return {
            cpf: cliente.cpf,
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
            estado: cliente.estado,
            salario: cliente.salario,
            conta: conta.conta,
            saldo: conta.saldo,
            limite: conta.limite,
            gerente: conta.gerente,
            gerente_nome: gerente?.nome ?? null,
            gerente_email: gerente?.email ?? null
          };
        });

      return res.status(200).json(composicao);
    }

    if (!filtro) {
      if (req.user.tipo !== 'GERENTE') {
        return res.status(403).json({
          message: 'O usuário não tem permissão para efetuar esta operação'
        });
      }

      const composicao = await buscarClientesComContaDoGerente(req);
      return res.status(200).json(composicao);
    }

    return res.status(400).json({
      message: 'Filtro não existe'
    });
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

router.get('/clientes/:cpf', authMiddleware, async (req, res, next) => {
  try {
    const cpf = req.params.cpf;

    if (!podeConsultarCliente(req, cpf)) {
      return res.status(403).json({
        message: 'O usuário não tem permissão para efetuar esta operação'
      });
    }

    const clienteResponse = await axios.get(
      `${process.env.CLIENTE_SERVICE_URL}/internal/clientes/${cpf}`,
      {
        headers: buildHeaders(req)
      }
    );

    let contaResponse = null;
    try {
      contaResponse = await axios.get(
        `${process.env.CONTA_SERVICE_URL}/internal/contas/cliente/${cpf}`,
        {
          headers: buildHeaders(req)
        }
      );
    } catch (error) {
      if (!error.response || error.response.status !== 404) {
        throw error;
      }
    }

    let gerenteResponse = null;
    const gerenteCpf = contaResponse?.data?.gerente || clienteResponse.data.gerenteCpf || null;

    if (gerenteCpf) {
      try {
        gerenteResponse = await axios.get(
          `${process.env.GERENTE_SERVICE_URL}/gerentes/${gerenteCpf}`,
          {
            headers: buildHeaders(req)
          }
        );
      } catch (error) {
        if (!error.response || error.response.status !== 404) {
          throw error;
        }
      }
    }

    return res.status(200).json({
      cpf: clienteResponse.data.cpf,
      nome: clienteResponse.data.nome,
      telefone: clienteResponse.data.telefone,
      email: clienteResponse.data.email,
      endereco: clienteResponse.data.endereco,
      cidade: clienteResponse.data.cidade,
      estado: clienteResponse.data.estado,
      salario: clienteResponse.data.salario,
      conta: contaResponse?.data?.conta ?? clienteResponse.data.contaNumero ?? null,
      saldo: contaResponse?.data?.saldo ?? null,
      limite: contaResponse?.data?.limite ?? null,
      gerente: gerenteCpf,
      gerente_nome: gerenteResponse?.data?.nome ?? null,
      gerente_email: gerenteResponse?.data?.email ?? null
    });
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

router.post('/clientes', async (req, res, next) => {
  try {
    const gerenteCpf = await escolherGerenteMenorCarga();

    if (!gerenteCpf) {
      return res.status(400).json({
        message: 'Nenhum gerente operacional disponível para aprovar o cliente'
      });
    }

    const payload = {
      ...req.body,
      gerenteCpf
    };

    const response = await axios.post(
      `${process.env.CLIENTE_SERVICE_URL}/clientes`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).send();
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

router.post('/clientes/:cpf/rejeitar', authMiddleware, requireRole('GERENTE'), async (req, res, next) => {
  try {
    const ehResponsavel = await validarGerenteResponsavel(req, req.params.cpf);

    if (!ehResponsavel) {
      return res.status(403).json({
        message: 'O usuário não tem permissão para efetuar esta operação'
      });
    }

    const response = await axios.post(
      `${process.env.SAGA_SERVICE_URL}/clientes/${req.params.cpf}/rejeitar`,
      req.body,
      {
        headers: {
          ...buildHeaders(req),
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).send();
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
router.post('/clientes/:cpf/aprovar', authMiddleware, requireRole('GERENTE'), async (req, res, next) => {
  try {
    const ehResponsavel = await validarGerenteResponsavel(req, req.params.cpf);

    if (!ehResponsavel) {
      return res.status(403).json({
        message: 'O usuário não tem permissão para efetuar esta operação'
      });
    }

    const response = await axios.post(
      `${process.env.SAGA_SERVICE_URL}/clientes/${req.params.cpf}/aprovar`,
      {},
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

router.put('/clientes/:cpf', authMiddleware, requireRole('CLIENTE'), async (req, res, next) => {
  try {
    if (req.user.cpf !== req.params.cpf) {
      return res.status(403).json({
        message: 'O usuário não tem permissão para efetuar esta operação'
      });
    }

    const response = await axios.put(
      `${process.env.SAGA_SERVICE_URL}/clientes/${req.params.cpf}`,
      req.body,
      {
        headers: {
          ...buildHeaders(req),
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).send();
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
