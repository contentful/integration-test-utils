import { Environment } from 'contentful-management';
import { initClient } from '../client/init-client';
import { SpaceNotProvidedError } from '../errors';
import { deleteTestEnvironment } from './delete-test-environment';

type CleanUpSpacesEnvironmentsOptions = {
  spaceId: string;
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

  const { dryRun, spaceId, regex } = {
    dryRun: false,
    regex: /.*/gm,
    ...options,
  };

  const client = initClient();
  const space = await client.getSpace(spaceId);
  const environments = await space.getEnvironments();

  const environmentsToDelete = filterDeletableEnvironments({
    environments: environments.items,
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
        deleteTestEnvironment(client, spaceId, id)
      )
    );
  }
};

type FilterEnvironmentsOptions = {
  environments: Environment[];
  regex: RegExp;
};

function filterDeletableEnvironments({
  environments,
  regex,
}: FilterEnvironmentsOptions) {
  return environments.filter(({ name }) => name.match(regex));
}
