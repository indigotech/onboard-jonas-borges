import axios from 'axios';
import { expect } from 'chai';

export const userQueryTests = (url: string) => {
  describe('user query tests', () => {
    it('should return an error when querying a user that does not exist', async () => {
      const userQuery = `
      query {
        user(id: "d0851a74-f9b2-4507-9405-6b3d7d8869b9") {
          id
          name
          email
          birthDate
        }
      }
    `;

      const response = await axios.post(url, {
        query: userQuery,
      });

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('User not found');
      expect(errorResponse.extensions.additionalInfo).to.be.equal('Check the user ID and try again');
    });
  });
};
