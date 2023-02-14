import { cleanUp } from '../../src/clean-up';
import { makeMockPlainClient } from '../mocks/planClient';

describe('cleanUp', () => {
  it('searches for environments to clean up and deletes envs with prefix', async () => {
    const spaces = ['test'];
    const client = makeMockPlainClient({
      space: {
        getMany: jest.fn().mockResolvedValue({
          items: [],
        }),
      },
      environment: {
        delete: jest.fn(),
        getMany: jest.fn().mockResolvedValue({
          items: [
            {
              name: '%as',
              sys: {
                updatedAt: new Date(Date.now() - 1_000_000_000).toISOString(),
              },
            },
            {
              name: '%df',
              sys: {
                updatedAt: new Date(Date.now() - 1_000_000_000).toISOString(),
              },
            },
          ],
        }),
      },
    });
    await cleanUp({ spaces, client });
    expect(client.space.getMany).toBeCalledTimes(1);
    expect(client.environment.delete).toBeCalledTimes(2);
  });
});
