'use strict';

const { pactWith } = require('jest-pact');

const { fetchBeerList, fetchBeer } = require('../client');

pactWith(
  { consumer: 'Beer-Consumer', provider: 'Beer-Provider' },
  (provider) => {
    describe('Beers API', () => {
      describe('List of beers', () => {
        const expectedBeerListFromServer = require('../../provider/data/beers.json');

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
          alcohol: 8.5,
          description:
            'The king of the abbey beers. It is amber-gold and pours with a deep head and original aroma, delivering a complex, full bodied flavour. Pure enjoyment! Secondary fermentation in the bottle.',
          id: 'AffligemTripel',
          img: '/img/AffligemTripel.jpg',
          name: 'Affligem Tripel',
        };

        beforeEach(() => {
          const beerByNameRequest = {
            uponReceiving: 'A request for a beer by name',
            withRequest: {
              method: 'GET',
              path: '/beer',
              query: {
                id: 'AffligemTripel',
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
            state: 'I have AffligemTripel in my list of beers',
            ...beerByNameRequest,
            willRespondWith: beerByNameSuccessResponse,
          };
          return provider.addInteraction(interaction);
        });

        it('returns a sucessful body', () => {
          return fetchBeer('AffligemTripel', {
            url: provider.mockService.baseUrl,
          }).then((beer) => {
            expect(beer).toEqual(expectedBeerResponse);
          });
        });
      });
    });
  }
);
