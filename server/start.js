const { server, importData } = require('./server.js');
importData();

server.listen(8081, () => {
  console.log('Beer server listening on http://localhost:8081');
});
