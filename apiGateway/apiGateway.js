require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

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

app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
  changeOrigin: true,
  logLevel: 'warn'
}));

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
