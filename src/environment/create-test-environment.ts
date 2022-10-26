import { Environment, Space } from 'contentful-management/types';
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

export async function createTestEnvironment(
  space: Space,
  environmentName: string
): Promise<Environment> {
  const testEnvironmentName = `${TEST_SPACE_PREFIX}${environmentName}`;
  if (testEnvironmentName.length > ENVIRONMENT_NAME_MAX_LENGTH) {
    throw new EnvironmentNameTooLongError(testEnvironmentName);
  }
  let createdEnvironment;
  try {
    createdEnvironment = await space.createEnvironment({
      name: testEnvironmentName,
    });
  } catch (e) {
    console.error(e);
  }
  if (!createdEnvironment) {
    throw new EnvironmentCreationFailedError(testEnvironmentName);
  }
  const readyEnvironment = await waitForEnvironmentToBeReady(
    space,
    createdEnvironment
  );
  return readyEnvironment;
}

export async function waitForEnvironmentToBeReady(
  space: Space,
  environment: Environment,
  timeElapsed: number = 0
): Promise<Environment> {
  if (timeElapsed > ENVIRONMENT_READY_TIMEOUT) {
    throw new EnvironmentNotReadyError(
      space.name,
      environment.name,
      timeElapsed
    );
  }
  const env = await space.getEnvironment(environment.sys.id);
  if (env.sys.status.sys.id !== 'ready') {
    console.log(
      `Environment ${environment.sys.id} is not ready yet. Waiting 1000ms...`
    );
    return sleep(1000).then(() =>
      waitForEnvironmentToBeReady(space, env, timeElapsed + 1000)
    );
  }
  return env;
}
