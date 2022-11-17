import { deleteTestEnvironment } from '../../src/environment/delete-test-environment';
import { makeMockPlainClient } from '../mocks/planClient';

const spaceId = 'space-id';
const environmentId = 'environment-id';

describe('deleteTestEnvironment', () => {
  it('deletes a space successfully', async () => {
    const client = makeMockPlainClient({
      environment: {
        delete: jest.fn(),
      },
    });
    await deleteTestEnvironment({ spaceId, environmentId, client });

    expect(client.environment.delete).toBeCalledTimes(1);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const client = makeMockPlainClient({
      environment: {
        delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
      },
    });

    await deleteTestEnvironment({ environmentId, spaceId, client });

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting environment ${environmentId} with error "${errorMessage}"`
    );
  });
});
