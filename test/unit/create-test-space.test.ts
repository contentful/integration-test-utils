import { TEST_SPACE_PREFIX } from '../../src/constants';
import {
  SpaceCreationFailedError,
  SpaceNameTooLongError,
} from '../../src/errors';
import {
  createTestSpace,
  CreateSpaceParams,
} from '../../src/space/create-test-space';
import { makeMockPlainClient } from '../mocks/planClient';

const defaultCreateSpaceArgs = {
  client: makeMockPlainClient({}),
  organizationId: 'org-id',
  repo: 'CMA',
  language: 'JS',
  testSuiteName: 'testSuiteName',
};

// @ts-ignore
const getCreateSpaceArgs = (params: Partial<typeof defaultCreateSpaceArgs>) =>
  (({
    ...defaultCreateSpaceArgs,
    ...params,
  } as unknown) as CreateSpaceParams);

describe('createTestSpace', () => {
  it('throws an error when the space name is too long', async () => {
    const client = makeMockPlainClient({
      space: {
        create: jest
          .fn()
          .mockRejectedValue(new Error('Some space creation error')),
      },
    });
    const args = getCreateSpaceArgs({
      testSuiteName: 'I am a test suite name that is too long',
      client,
    });

    await expect(createTestSpace(args)).rejects.toBeInstanceOf(
      SpaceNameTooLongError
    );
  });

  it('throws an error when the space could not be created', async () => {
    const client = makeMockPlainClient({
      space: {
        create: jest
          .fn()
          .mockRejectedValue(new Error('Some space creation error')),
      },
    });
    const args = getCreateSpaceArgs({ client });

    await expect(createTestSpace(args)).rejects.toBeInstanceOf(
      SpaceCreationFailedError
    );
  });

  it('creates a space with correct name pattern', async () => {
    const client = makeMockPlainClient({
      space: {
        create: jest.fn().mockResolvedValue({
          name: `${TEST_SPACE_PREFIX} ${defaultCreateSpaceArgs.language} ${defaultCreateSpaceArgs.repo} ${defaultCreateSpaceArgs.testSuiteName}`,
        }),
      },
    });

    const args = getCreateSpaceArgs({
      client,
    });
    const { language, repo, testSuiteName } = args;
    const expectedSpaceName = `${TEST_SPACE_PREFIX} ${language} ${repo} ${testSuiteName}`;
    const space = await createTestSpace(args);

    expect(space.name).toEqual(expectedSpaceName);
  });
});
