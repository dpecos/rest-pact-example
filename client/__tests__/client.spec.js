'use strict';

const { pactWith } = require('jest-pact');
const { Matchers } = require('@pact-foundation/pact');

const { fetchBeerList, fetchBeer } = require('../client');

pactWith({ consumer: 'Beer-Client', provider: 'Beer-Server' }, (provider) => {
  describe('Beers API', () => {
    describe('List of beers', () => {
      const expectedBeerListFromServer = require('../../server/data/beers.json');

      beforeEach(() => {
        const beerListRequest = {
          uponReceiving: 'A request for beers',
          withRequest: {
            method: 'GET',
            path: '/beers',
            headers: {
              Accept: 'application/json',
            },
          },
        };

        const beerListSuccessResponse = {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: expectedBeerListFromServer,
        };

        const interaction = {
          state: 'I have a list of beers',
          ...beerListRequest,
          willRespondWith: beerListSuccessResponse,
        };
        return provider.addInteraction(interaction);
      });

      it('returns a sucessful body', () => {
        return fetchBeerList({
          url: provider.mockService.baseUrl,
        }).then((beers) => {
          expect(beers).toEqual(expectedBeerListFromServer);
        });
      });
    });

    describe('Retrieve specific beer by name', () => {
      const expectedBeerResponse = {
        brewery: 'Haandbryggeriet',
        name: 'Nissefar',
        score: 6.07,
        abv: 7,
      };

      beforeEach(() => {
        const beerByNameRequest = {
          uponReceiving: 'A request for a beer by name',
          withRequest: {
            method: 'GET',
            path: '/beer',
            query: {
              name: Matchers.string('Nissefar'),
            },
            headers: {
              Accept: 'application/json',
            },
          },
        };

        const beerByNameSuccessResponse = {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: expectedBeerResponse,
        };

        const interaction = {
          state: 'I have Nissefar in my list of beers',
          ...beerByNameRequest,
          willRespondWith: beerByNameSuccessResponse,
        };
        return provider.addInteraction(interaction);
      });

      it('returns a sucessful body', () => {
        return fetchBeer('Nissefar', {
          url: provider.mockService.baseUrl,
        }).then((beer) => {
          expect(beer).toEqual(expectedBeerResponse);
        });
      });
    });
  });
});
