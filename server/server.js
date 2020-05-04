const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Repository = require('./repository');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

const beerRepository = new Repository();

// Load default data into a repository
const importData = () => {
  const data = require('./data/beers.json');
  data.reduce((a, v) => {
    v.id = a + 1;
    beerRepository.insert(v);
    return a + 1;
  }, 0);
};

// List all beers with 'available' eligibility
const availableBeers = () => {
  return beerRepository.fetchAll().filter((a) => {
    return a.eligibility.available;
  });
};

// Get all beers
server.get('/beers', (req, res) => {
  res.json(beerRepository.fetchAll());
});

// Find an beer by ID
server.get('/beers/:id', (req, res) => {
  const response = beerRepository.getById(req.params.id);
  if (response) {
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Register a new Beer for the service
server.post('/beers', (req, res) => {
  const beer = req.body;

  // Really basic validation
  if (!beer || !beer.name) {
    res.writeHead(400);
    res.end();

    return;
  }

  beer.id = beerRepository.fetchAll().length;
  beerRepository.insert(beer);

  res.json(beer);
});

module.exports = {
  server,
  importData,
  beerRepository: beerRepository,
};
