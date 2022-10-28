import { cleanUp } from '../../src/clean-up';
import * as client from '../../src/client/init-client';

jest.mock('../../src/client/init-client', () => ({
  initClient: jest.fn().mockReturnValue({
    getSpace: jest.fn().mockResolvedValue({
      getEnvironments: jest.fn().mockReturnValue({
        items: [{
          name: '%test-env',
          sys: {
            updatedAt: Date.now()
          }
        }],
      }),
      getEnvironment: jest.fn().mockReturnValue({
        delete: jest.fn(),
      }),
    }),
  }),
}));

describe('cleanUp', () => {
  it.only('searches for environments to clean up and deletes envs with prefix', async () => {
    const spaces = ['test']
    // const consoleSpy = jest.spyOn(console, 'log');
    await cleanUp({ spaces });
    expect(client.initClient().getSpace).toHaveBeenCalledTimes(spaces.length);
  });
});
