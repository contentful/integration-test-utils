import { Space } from 'contentful-management/types';
import {
  EnvironmentNameTooLongError,
  EnvironmentCreationFailedError,
  EnvironmentNotReadyError,
} from '../../src/errors';
import {
  createTestEnvironment,
  waitForEnvironmentToBeReady,
} from '../../src/environment/create-test-environment';

const defaultEnvName = 'env-name';

const defaultMockEnv = {
  name: defaultEnvName,
  sys: { id: 'env-id', status: { sys: { id: 'ready' } } },
};

const defaultMockSpace = {
  createEnvironment: jest.fn().mockResolvedValue(defaultMockEnv),
  getEnvironment: jest.fn().mockResolvedValue(defaultMockEnv),
};

// @ts-ignore
const getMockSpace = (args = {}): Space => ({
  ...defaultMockSpace,
  ...args,
});

describe('createTestEnvironment', () => {
  it('throws an error when the environment name is too long', async () => {
    const mockSpace = getMockSpace();
    const envName = 'I am an environment name that is too long';

    await expect(
      createTestEnvironment(mockSpace, envName)
    ).rejects.toBeInstanceOf(EnvironmentNameTooLongError);
  });

  it('throws an error when environment creation fails', async () => {
    const mockSpace = getMockSpace({
      createEnvironment: jest
        .fn()
        .mockRejectedValue(new Error('Some environment creation error')),
    });

    await expect(
      createTestEnvironment(mockSpace, defaultEnvName)
    ).rejects.toBeInstanceOf(EnvironmentCreationFailedError);
  });

  it('creates an environment successfully', async () => {
    const mockSpace = getMockSpace();
    const environment = await createTestEnvironment(mockSpace, defaultEnvName);

    expect(environment.name).toEqual(defaultEnvName);
  });

  it('creates an environment successfully and waits for it to be ready', async () => {
    const mockEnvNotReady = {
      name: defaultEnvName,
      sys: { id: 'env-id', status: { sys: { id: 'queued' } } },
    };
    const mockSpace = getMockSpace({
      createEnvironment: jest.fn().mockResolvedValue(mockEnvNotReady),
      getEnvironment: jest
        .fn()
        .mockResolvedValueOnce(mockEnvNotReady)
        .mockResolvedValue(defaultMockEnv),
    });
    const environment = await createTestEnvironment(mockSpace, defaultEnvName);

    expect(environment.name).toEqual(defaultEnvName);
    expect(environment.sys.status.sys.id).toEqual('ready');
  });
});

describe('waitForEnvironmentToBeReady', () => {
  it('throws an error if environment takes longer than 5 minutes to be ready', async () => {
    const space = {};
    const environment = {};
    const timeElapsed = 60 * 60 * 1000 * 5 + 1;

    await expect(
      // @ts-ignore
      waitForEnvironmentToBeReady(space, environment, timeElapsed)
    ).rejects.toBeInstanceOf(EnvironmentNotReadyError);
  });
});
