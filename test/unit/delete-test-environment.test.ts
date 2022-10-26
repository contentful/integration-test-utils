import { ClientAPI } from 'contentful-management';
import { deleteTestEnvironment } from '../../src/environment/delete-test-environment';

const spaceId = 'space-id';
const environmentId = 'environment-id';

const defaultMockSpace = {
  getEnvironment: async () => ({
    delete: jest.fn(),
  }),
};

// @ts-ignore
const getMockClient = (space = defaultMockSpace): ClientAPI => ({
  getSpace: jest.fn().mockResolvedValue(space),
});

describe('deleteTestEnvironment', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const mockClient = getMockClient();
    await deleteTestEnvironment(mockClient, spaceId, environmentId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Deleted environment ${environmentId}`
    );
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const mockSpace = {
      getEnvironment: async () => ({
        delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
      }),
    };

    const mockClient = getMockClient(mockSpace);
    await deleteTestEnvironment(mockClient, spaceId, environmentId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting environment ${environmentId} with error "${errorMessage}"`
    );
  });
});
