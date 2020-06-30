import chai, { expect } from 'chai';

import { TEST_APP, random, repos } from 'test/setup';

describe('(API) User', () => {
  describe('read', () => {
    const user = random.user();

    beforeEach(async () => {
      repos.userRepo.insertOne(user);
    });

    it('should fetch a user', async () => {
      const res = await chai.request(TEST_APP)
        .get(`/api/v1/users/${user.id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        ...res.body,
        name: user.name,
      });
    });
    it('should return 404 if user is not found', async () => {
      const res = await chai.request(TEST_APP)
        .get(`/api/v1/users/${random.guid()}`);

      expect(res).to.have.status(404);
    });
    it('should return 404 for malformed id', async () => {
      const res = await chai.request(TEST_APP)
        .get('/api/v1/users/not-a-uuid');

      expect(res).to.have.status(404);
    });
  });
});
