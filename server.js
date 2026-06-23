const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const path = require('path');
const fs = require('fs');

// Verificar se o db.json existe
if (!fs.existsSync('db.json')) {
  console.error('❌ db.json não encontrado!');
  process.exit(1);
}

// Porta dinâmica para Vercel
const port = process.env.PORT || 3000;

// Middlewares padrão
server.use(middlewares);

// Habilitar CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Rota de saúde (health check)
server.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz
server.get('/', (req, res) => {
  res.json({
    name: 'E-commerce API',
    version: '1.0.0',
    endpoints: {
      products: '/products',
      categories: '/categories',
      cart: '/cart',
      orders: '/orders',
      users: '/users'
    },
    docs: 'https://github.com/typicode/json-server'
  });
});

// Usar o roteador do json-server
server.use(router);

// Tratamento de erros
server.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`✅ JSON Server está rodando na porta ${port}`);
  console.log(`📦 db.json carregado com sucesso`);
  console.log(`🔗 http://localhost:${port}`);
});

// Exportar para Vercel
module.exports = server;