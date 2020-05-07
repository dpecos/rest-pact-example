const axios = require('axios');

exports.fetchBeerList = (endpoint) => {
  const url = endpoint.url;

  return axios
    .request({
      method: 'GET',
      baseURL: url,
      url: '/beers',
      headers: { Accept: 'application/json' },
    })
    .then((response) => response.data);
};

exports.fetchBeer = (id, endpoint) => {
  const url = endpoint.url;

  return axios
    .request({
      method: 'GET',
      baseURL: url,
      url: '/beer?id=' + id,
      headers: { Accept: 'application/json' },
    })
    .then((response) => response.data);
};
