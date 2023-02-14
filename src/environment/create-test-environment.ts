import { EnvironmentProps, PlainClientAPI } from 'contentful-management';
import {
  ENVIRONMENT_NAME_MAX_LENGTH,
  ENVIRONMENT_READY_TIMEOUT,
  TEST_SPACE_PREFIX,
} from './../constants';
import {
  EnvironmentNameTooLongError,
  EnvironmentCreationFailedError,
  EnvironmentNotReadyError,
} from '../errors';
import { sleep } from '../utils';
import { initClient } from '../client/init-client';

type CreateTestEnvironmentProps = {
  spaceId: string;
  environmentId: string;
  client?: PlainClientAPI;
};

export async function createTestEnvironment(
  options: CreateTestEnvironmentProps
): Promise<EnvironmentProps> {
  const { environmentId, spaceId, client } = {
    client: options.client ?? initClient(),
    ...options,
  };

  const testEnvironmentId = `${TEST_SPACE_PREFIX}${environmentId}`;
  if (testEnvironmentId.length > ENVIRONMENT_NAME_MAX_LENGTH) {
    throw new EnvironmentNameTooLongError(testEnvironmentId);
  }

  let createdEnvironment;
  try {
    createdEnvironment = await client.environment.create(
      { spaceId },
      {
        name: testEnvironmentId,
      }
    );
  } catch (e) {
    console.error(e);
  }
  if (!createdEnvironment) {
    throw new EnvironmentCreationFailedError(testEnvironmentId);
  }
  const readyEnvironment = await waitForEnvironmentToBeReady({
    client,
    spaceId,
    environmentId: testEnvironmentId,
  });
  return readyEnvironment;
}

type WaitForEnvironmentProps = {
  spaceId: string;
  environmentId: string;
  client?: PlainClientAPI;
  timeElapsed?: number;
};

export async function waitForEnvironmentToBeReady(
  options: WaitForEnvironmentProps
): Promise<EnvironmentProps> {
  const { spaceId, environmentId, timeElapsed, client } = {
    client: options.client ?? initClient(),
    timeElapsed: 0,
    ...options,
  };

  if (timeElapsed > ENVIRONMENT_READY_TIMEOUT) {
    throw new EnvironmentNotReadyError(spaceId, environmentId, timeElapsed);
  }
  const env = await client.environment.get({ environmentId });
  if (env.sys.status.sys.id !== 'ready') {
    console.log(
      `Environment ${environmentId} is not ready yet. Waiting 1000ms...`
    );
    return sleep(1000).then(() =>
      waitForEnvironmentToBeReady({
        client,
        spaceId,
        environmentId,
        timeElapsed: timeElapsed + 1000,
      })
    );
  }
  return env;
}
