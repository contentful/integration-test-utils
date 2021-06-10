import { ClientAPI } from 'contentful-management';
import { deleteSpace } from '../../src/space/delete-space';

const spaceId = 'space-id';

const defaultMockSpace = {
  delete: jest.fn(),
};

// @ts-ignore
const getMockClient = (space = defaultMockSpace): ClientAPI => ({
  getSpace: jest.fn().mockResolvedValue(space),
});

describe('deleteSpace', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const mockClient = getMockClient();
    await deleteSpace(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(`Deleted space ${spaceId}`);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const mockSpace = {
      delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    const mockClient = getMockClient(mockSpace);
    await deleteSpace(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
