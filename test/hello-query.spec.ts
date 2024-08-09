import axios from 'axios';
import { expect } from 'chai';

export const helloTests = (url: string) => {
  describe('Hello query tests', () => {
    it('should execute the hello query', async () => {
      const response = await axios.post(url, {
        query: `
        query {
          hello
        }
      `,
      });

      expect(response.data.data.hello).to.be.equal('Hello, world!');
    });
  });
};
