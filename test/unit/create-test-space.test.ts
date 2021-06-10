import { TEST_SPACE_PREFIX } from '../../src/constants';
import {
  SpaceCreationFailedError,
  SpaceNameTooLongError,
} from '../../src/errors';
import {
  createTestSpace,
  CreateSpaceParams,
} from '../../src/space/create-test-space';

const mockClient = {
  createSpace: jest.fn().mockResolvedValue({ name: '% JS CMA testSuiteName' }),
};

const defaultCreateSpaceArgs = {
  client: mockClient,
  organizationId: 'org-id',
  repo: 'CMA',
  language: 'JS',
  testSuiteName: 'testSuiteName',
};

// @ts-ignore
const getCreateSpaceArgs = (params = {}): CreateSpaceParams => ({
  ...defaultCreateSpaceArgs,
  ...params,
});

describe('createTestSpace', () => {
  it('throws an error when the space name is too long', async () => {
    const args = getCreateSpaceArgs({
      testSuiteName: 'I am a test suite name that is too long',
    });

    await expect(createTestSpace(args)).rejects.toBeInstanceOf(
      SpaceNameTooLongError
    );
  });

  it('throws an error when the space could not be created', async () => {
    const client = {
      createSpace: jest
        .fn()
        .mockRejectedValue(new Error('Some space creation error')),
    };
    const args = getCreateSpaceArgs({ client });

    await expect(createTestSpace(args)).rejects.toBeInstanceOf(
      SpaceCreationFailedError
    );
  });

  it('creates a space with space with correct name pattern', async () => {
    const args = getCreateSpaceArgs();
    const { language, repo, testSuiteName } = args;
    const expectedSpaceName = `${TEST_SPACE_PREFIX} ${language} ${repo} ${testSuiteName}`;
    const space = await createTestSpace(args);

    expect(space.name).toEqual(expectedSpaceName);
  });
});
