import axios from 'axios';
import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from '../src/graphql/graphql-schema.js';
import * as dotenv from 'dotenv';
import { expect } from 'chai';

dotenv.config({ path: './test/test.env' });

let url: string;
const PORT = process.env.TEST_PORT || 4001;

before(async () => {
  const { url: serverUrl } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
  });

  url = serverUrl;
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
