const { createProxyMiddleware } = require('http-proxy-middleware');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Ruta al archivo JSON
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports.handler = (event, context) => {
  const proxy = createProxyMiddleware({
    target: 'http://localhost:3000', // Cambia este puerto si es necesario
    changeOrigin: true,
    pathRewrite: { '^/.netlify/functions/json-server': '' },
    logLevel: 'debug',
  });

  return new Promise((resolve, reject) => {
    server.use('/.netlify/functions/json-server', proxy);
    server.listen(9000, () => {
      resolve({
        statusCode: 200,
        body: 'JSON Server is running',
      });
    });
  });
};