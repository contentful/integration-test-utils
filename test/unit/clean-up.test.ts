import { cleanUp } from '../../src/clean-up';
import { makeMockPlainClient } from '../mocks/planClient';

describe('cleanUp', () => {
  it.only('searches for environments to clean up and deletes envs with prefix', async () => {
    const spaces = ['test'];
    const client = makeMockPlainClient({
      environment: {
        delete: jest.fn(),
        getMany: jest.fn().mockReturnValue({
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
    expect(client.environment.delete).toBeCalledTimes(2);
  });
});
