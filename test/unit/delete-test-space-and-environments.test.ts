import { ClientAPI } from 'contentful-management';
import { deleteTestSpaceAndEnvironments } from '../../src/space/delete-test-space-and-environments';

const spaceId = 'space-id';

const mockEnvironments = {
  items: [
    {
      delete: jest.fn(),
    },
  ],
};

const defaultMockSpace = {
  delete: jest.fn(),
  getEnvironments: jest.fn().mockReturnValue(mockEnvironments),
};

// @ts-ignore
const getMockClient = (space = defaultMockSpace): ClientAPI => ({
  getSpace: jest.fn().mockResolvedValue(space),
});

describe('deleteTestSpaceAndEnvironments', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const mockClient = getMockClient();
    await deleteTestSpaceAndEnvironments(mockClient, spaceId);

    expect(defaultMockSpace.getEnvironments).toHaveBeenCalled();
    expect(mockEnvironments.items[0].delete).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(`Deleted space ${spaceId}`);
  });

  it('informs when space deletion was unsuccessful', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const errorMessage = 'some deletion error';
    const mockSpace = {
      delete: jest.fn().mockRejectedValue(new Error(errorMessage)),
      getEnvironments: jest.fn().mockReturnValue({
        items: [
          {
            delete: jest.fn(),
          },
        ],
      }),
    };
    const mockClient = getMockClient(mockSpace);
    await deleteTestSpaceAndEnvironments(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
