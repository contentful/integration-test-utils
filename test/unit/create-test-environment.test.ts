import {
  EnvironmentNameTooLongError,
  EnvironmentCreationFailedError,
  EnvironmentNotReadyError,
} from '../../src/errors';
import {
  createTestEnvironment,
  waitForEnvironmentToBeReady,
} from '../../src/environment/create-test-environment';
import { makeMockPlainClient } from '../mocks/planClient';

const defaultSpaceId = 'space-id';
const defaultEnvName = 'env-name';

const defaultMockEnv = {
  name: defaultEnvName,
  sys: { id: 'env-id', status: { sys: { id: 'ready' } } },
};

describe('createTestEnvironment', () => {
  it('throws an error when the environment name is too long', async () => {
    const envName = 'I am an environment name that is too long';

    const client = makeMockPlainClient({});
    await expect(
      createTestEnvironment({
        spaceId: defaultSpaceId,
        environmentId: envName,
        client,
      })
    ).rejects.toBeInstanceOf(EnvironmentNameTooLongError);
  });

  it('throws an error when environment creation fails', async () => {
    const client = makeMockPlainClient({
      environment: {
        create: jest
          .fn()
          .mockRejectedValue(new Error('Some environment creation error')),
      },
    });

    await expect(
      createTestEnvironment({
        spaceId: defaultSpaceId,
        environmentId: defaultEnvName,
        client,
      })
    ).rejects.toBeInstanceOf(EnvironmentCreationFailedError);
  });

  it('creates an environment successfully', async () => {
    const client = makeMockPlainClient({
      environment: {
        get: jest.fn().mockResolvedValue({
          sys: {
            status: {
              sys: {
                id: 'ready',
              },
            },
          },
          name: defaultEnvName,
        }),
        create: jest.fn().mockResolvedValue({
          name: defaultEnvName,
        }),
      },
    });

    const environment = await createTestEnvironment({
      spaceId: defaultSpaceId,
      environmentId: defaultEnvName,
      client,
    });

    expect(environment.name).toEqual(defaultEnvName);
  });

  it('creates an environment successfully and waits for it to be ready', async () => {
    const mockEnvNotReady = {
      name: defaultEnvName,
      sys: { id: 'env-id', status: { sys: { id: 'queued' } } },
    };

    const client = makeMockPlainClient({
      environment: {
        create: jest.fn().mockResolvedValue(mockEnvNotReady),
        get: jest
          .fn()
          .mockResolvedValueOnce(mockEnvNotReady)
          .mockResolvedValue(defaultMockEnv),
      },
    });

    const environment = await createTestEnvironment({
      spaceId: defaultSpaceId,
      environmentId: defaultEnvName,
      client,
    });

    expect(environment.name).toEqual(defaultEnvName);
    expect(environment.sys.status.sys.id).toEqual('ready');
  });
});

describe('waitForEnvironmentToBeReady', () => {
  it('throws an error if environment takes longer than 5 minutes to be ready', async () => {
    const timeElapsed = 60 * 60 * 1000 * 5 + 1;

    await expect(
      waitForEnvironmentToBeReady({
        client: makeMockPlainClient({}),
        spaceId: '',
        environmentId: '',
        timeElapsed,
      })
    ).rejects.toBeInstanceOf(EnvironmentNotReadyError);
  });
});
