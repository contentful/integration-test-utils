import { ClientAPI } from 'contentful-management';
import { deleteTestSpace } from '../../src/space/delete-test-space';

const spaceId = 'space-id';

const defaultMockSpace = {
  delete: jest.fn(),
};

// @ts-ignore
const getMockClient = (space = defaultMockSpace): ClientAPI => ({
  getSpace: jest.fn().mockResolvedValue(space),
});

describe('deleteTestSpace', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const mockClient = getMockClient();
    await deleteTestSpace(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(`Deleted space ${spaceId}`);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const mockSpace = {
      delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    const mockClient = getMockClient(mockSpace);
    await deleteTestSpace(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
