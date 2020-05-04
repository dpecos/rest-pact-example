'use strict';
const path = require('path');
const childProcess = require('child_process');

const { Verifier } = require('@pact-foundation/pact');
const { app, importData, beerRepository } = require('../server.js');

const exec = (command) => childProcess.execSync(command).toString().trim();
const commitId = exec('git rev-parse HEAD');
const branch = exec('git rev-parse --abbrev-ref HEAD');

const JEST_TIMEOUT = 30000;

describe('Pact Verification', () => {
  let server = null;

  beforeAll((done) => {
    server = app.listen(8081, () => {
      console.log('Beer server listening on http://localhost:8081');
      done();
    });
  });

  afterAll(() => {
    server.close();
  });

  it(
    'validates the expectations of Beer-Server',
    (done) => {
      let opts = {
        logLevel: 'WARN',

        provider: 'Beer-Server',
        providerVersion: commitId,
        providerBaseUrl: 'http://localhost:8081',

        stateHandlers: {
          'Has no beers': () => {
            beerRepository.clear();
            return Promise.resolve(`Animals removed to the db`);
          },
          'I have a list of beers': () => {
            importData();
            return Promise.resolve(`Beers added to the db`);
          },
          'I have Nissefar in my list of beers': () => {
            importData();
            return Promise.resolve(`Beers added to the db`);
          },
        },

        // Fetch from broker with given tags
        consumerVersionTags: ['master'],

        // Tag provider with given tags
        providerVersionTags: [branch],

        // Enables "pending pacts" feature
        // enablePending: true,

        // Local pacts
        pactUrls: [path.resolve('pact/pacts/beer-client-beer-server.json')],

        // Fetch pacts from broker
        // pactBrokerUrl: 'https://test.pact.dius.com.au/',
        // pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
        // pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
        // publishVerificationResult: true,
      };

      new Verifier(opts)
        .verifyProvider()
        .then((output) => {
          console.log('Pact Verification Complete!');
          console.log(output);

          done();
        })
        .catch((err) => {
          done(err);
        });
    },
    JEST_TIMEOUT
  );
});
