import { EnvironmentProps, PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';
import {
  DEFAULT_SPACE_DELETION_THRESHOLD,
  TEST_SPACE_PREFIX,
} from '../constants';
import { SpaceNotProvidedError } from '../errors';
import { deleteTestEnvironment } from './delete-test-environment';

type CleanUpSpacesEnvironmentsOptions = {
  spaceId: string;
  client?: PlainClientAPI;
  threshold?: number;
  regex?: RegExp;
  dryRun?: boolean;
};

type CleanUpSpacesEnvironments = (
  options?: CleanUpSpacesEnvironmentsOptions
) => Promise<void>;

export const cleanUpTestEnvironments: CleanUpSpacesEnvironments = async options => {
  if (!options?.spaceId) {
    throw new SpaceNotProvidedError();
  }

  const { dryRun, spaceId, prefix, regex, client } = {
    dryRun: false,
    prefix: TEST_SPACE_PREFIX,
    client: options.client ?? initClient(),
    ...options,
  };

  const environments = await client.environment.getMany({ spaceId });

  const environmentsToDelete = filterDeletableEnvironments({
    environments: environments.items,
    threshold: DEFAULT_SPACE_DELETION_THRESHOLD,
    prefix,
    regex,
  });

  if (environmentsToDelete.length === 0) {
    console.log('No environments to delete in the space');
  }

  if (dryRun) {
    console.log("To delete the following environments, set 'dryRun' to false");
    console.log(
      environmentsToDelete.map(
        ({ name, sys: { id } }) => `environment "${name}" id:${id}`
      )
    );
  } else {
    await Promise.allSettled(
      environmentsToDelete.map(({ sys: { id } }) =>
        deleteTestEnvironment({ spaceId, environmentId: id, client })
      )
    );
  }
};

type FilterEnvironmentsOptions = {
  environments: EnvironmentProps[];
  regex?: RegExp;
  prefix: string;
  threshold: number;
};

function filterDeletableEnvironments({
  environments,
  regex,
  prefix,
  threshold,
}: FilterEnvironmentsOptions) {
  return environments.filter(environment => {
    if (regex) {
      return (
        environment.name.match(regex) &&
        Date.parse(environment.sys.updatedAt) + threshold < Date.now()
      );
    }

    return (
      environment.name.startsWith(prefix) &&
      Date.parse(environment.sys.updatedAt) + threshold < Date.now()
    );
  });
}
