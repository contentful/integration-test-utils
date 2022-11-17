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
import { EnvironmentProps, PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

export async function createTestEnvironment(
  spaceId: string,
  environmentName: string,
  client?: PlainClientAPI
): Promise<EnvironmentProps> {
  const testEnvironmentName = `${TEST_SPACE_PREFIX}${environmentName}`;
  if (testEnvironmentName.length > ENVIRONMENT_NAME_MAX_LENGTH) {
    throw new EnvironmentNameTooLongError(testEnvironmentName);
  }
  client = client ?? initClient();

  let createdEnvironment;
  try {
    createdEnvironment = await client.environment.create(
      { spaceId },
      {
        name: testEnvironmentName,
      }
    );
  } catch (e) {
    console.error(e);
  }
  if (!createdEnvironment) {
    throw new EnvironmentCreationFailedError(testEnvironmentName);
  }
  const readyEnvironment = await waitForEnvironmentToBeReady(
    client,
    spaceId,
    environmentName
  );
  return readyEnvironment;
}

export async function waitForEnvironmentToBeReady(
  client: PlainClientAPI,
  spaceId: string,
  environmentId: string,
  timeElapsed: number = 0
): Promise<EnvironmentProps> {
  if (timeElapsed > ENVIRONMENT_READY_TIMEOUT) {
    throw new EnvironmentNotReadyError(spaceId, environmentId, timeElapsed);
  }
  const env = await client.environment.get({ environmentId });
  if (env.sys.status.sys.id !== 'ready') {
    console.log(
      `Environment ${environmentId} is not ready yet. Waiting 1000ms...`
    );
    return sleep(1000).then(() =>
      waitForEnvironmentToBeReady(
        client,
        spaceId,
        environmentId,
        timeElapsed + 1000
      )
    );
  }
  return env;
}
