require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const authRoutes = require('./auth.routes');
const clienteRoutes = require('./cliente.routes');
const contaRoutes = require('./conta.routes');
const gerenteRoutes = require('./gerente.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BANTADS API Gateway ativo');
});

app.use('/auth', authRoutes);

app.use(clienteRoutes);
app.use(contaRoutes);
app.use(gerenteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno no gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway em http://localhost:${PORT}`);
});
