const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Repository = require('./repository');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

const beerRepository = new Repository();

const importData = () => {
  const data = require('./data/beers.json');
  data.forEach((beer) => {
    beerRepository.insert(beer);
  });
};

app.get('/beers', (req, res) => {
  res.json(beerRepository.fetchAll());
});

app.get('/beer', (req, res) => {
  const response = beerRepository.getByName(req.query.name);
  if (response) {
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404);
    res.end();
  }
});

module.exports = {
  app,
  importData,
  beerRepository: beerRepository,
};
