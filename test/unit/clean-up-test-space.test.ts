import { ClientAPI } from 'contentful-management';
import { cleanUpSpace } from '../../src/space/clean-up-test-space';

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

describe('cleanUpSpace', () => {
  it('deletes a space successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const mockClient = getMockClient();
    await cleanUpSpace(mockClient, spaceId);

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
    await cleanUpSpace(mockClient, spaceId);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error deleting space ${spaceId} with error "${errorMessage}"`
    );
  });
});
