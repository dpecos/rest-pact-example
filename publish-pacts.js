const { Publisher } = require('@pact-foundation/pact');
const path = require('path');
const childProcess = require('child_process');

const exec = (command) => childProcess.execSync(command).toString().trim();

const commitId = exec('git rev-parse HEAD');
const branch = exec('git rev-parse --abbrev-ref HEAD');

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'pact/pacts')],
  pactBroker: 'https://test.pact.dius.com.au',
  pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
  pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
  consumerVersion: commitId,
  tags: [branch],
};

new Publisher(opts)
  .publishPacts()
  .then(() => {
    console.log('Pact contract publishing complete!');
    console.log('');
    console.log('Head over to https://test.pact.dius.com.au/ and login with');
    console.log('=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M');
    console.log('=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1');
    console.log('to see your published contracts.');
  })
  .catch((e) => {
    console.log('Pact contract publishing failed: ', e);
  });
