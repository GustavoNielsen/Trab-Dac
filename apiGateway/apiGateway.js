// Install packages: npm install jsonwebtoken dotenv
require('dotenv').config(); // Loads .env file at the start of your app

const jwt = require('jsonwebtoken');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(cors());

// Armazena a chave secreta
const SECRET = process.env.JWT_SECRET; 

// app.use('/gerentes', verificarToken, createProxyMiddleware({ ... }));
// Função middleware para verificar o token JWT em cada requisição
function verificarToken(req, res, next) {
  // O token vem geralmente no cabeçalho 'authorization'
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    return res.status(401).send('Acesso negado. Token não fornecido.');
  }

  // O formato esperado é "Bearer <token-aqui>", por isso separamos a string
  const token = tokenHeader.split(' ')[1];

  // A biblioteca faz a magia matemática para validar se o token foi alterado ou expirou
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido ou expirado.');
    }
    
    // Se for válido, podemos guardar os dados descodificados (como o perfil) no req
    req.userRole = decoded.perfil;
    
    // O next() é o semáforo verde: deixa a requisição seguir para o microsserviço!
    next(); 
  });
}

// Rota principal (teste)
app.get('/', (req, res) => {
  res.send('Gateway ativo e roteando requisições!');
});

// Rota para o microserviço de autenticação
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:8081/auth',
  changeOrigin: true,
  logLevel: 'debug',   
}));

// Deve ficar no final do arquivo para evitar conflitos com outras rotas
app.listen(PORT, () => {
  console.log(`🚀 API Gateway rodando em http://localhost:${PORT}`);
});


const { createProxyMiddleware } = require('http-proxy-middleware' );

// Middleware de verificação de Token
function verificarToken(req, res, next) {
  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader) return res.status(401).send('Acesso negado.');
  
  const token = tokenHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido.');
    req.userRole = decoded.perfil;
    next(); 
  });
}

// Rota para o microserviço de autenticação
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:8081/auth',
  changeOrigin: true,
} ));