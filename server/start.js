const { app, importData } = require('./server.js');
importData();

app.listen(8081, () => {
  console.log('Beer server listening on http://localhost:8081');
});
