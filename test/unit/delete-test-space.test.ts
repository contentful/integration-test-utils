import { deleteTestSpace } from '../../src/space/delete-test-space';
import { makeMockPlainClient } from '../mocks/planClient';

const spaceId = 'space-id';

describe('deleteTestSpace', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const client = makeMockPlainClient({
      space: {
        delete: jest.fn(),
      },
    });
    await deleteTestSpace({ spaceId, client });

    expect(consoleSpy).toHaveBeenCalledWith(`Deleted space ${spaceId}`);
    expect(client.space.delete).toBeCalledTimes(1);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const client = makeMockPlainClient({
      space: {
        delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
      },
    });

    await deleteTestSpace({ spaceId, client });

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
