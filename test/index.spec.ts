import axios from 'axios';
import { expect } from 'chai';
import { mochaGlobalSetup } from './setup.js';

let url: string;

before(async () => {
  url = await mochaGlobalSetup();
});

describe('GraphQL API Tests', () => {
  it('should execute the hello query', async () => {
    const response = await axios.post(url, {
      query: `
        query {
          hello
        }
      `,
    });

    expect(response.data.data.hello).to.equal('Hello, world!');
  });
});
