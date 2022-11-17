import { cleanUpSpace } from '../../src/space/clean-up-test-space';
import { makeMockPlainClient } from '../mocks/planClient';

const spaceId = 'space-id';

describe('cleanUpSpace', () => {
  it('deletes a space successfully', async () => {
    const client = makeMockPlainClient({
      space: { delete: jest.fn() },
    });
    await cleanUpSpace({ spaceId, client });

    expect(client.space.delete).toBeCalledTimes(1);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const client = makeMockPlainClient({
      space: { delete: jest.fn().mockRejectedValue(new Error(errorMessage)) },
    });
    await cleanUpSpace({ spaceId, client });

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
