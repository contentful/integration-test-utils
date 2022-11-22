import { PlainClientAPI } from 'contentful-management';
import { initClient } from './client/init-client';
import { cleanUpTestEnvironments } from './environment/clean-up-test-environments';
import { cleanUpTestSpaces } from './space/clean-up-test-spaces';

type CleanUpSpacesOptions = {
  client?: PlainClientAPI;
  spaces: string[];
  regex?: RegExp;
  threshold?: number;
  dryRun?: boolean;
};

export async function cleanUp(options: CleanUpSpacesOptions) {
  const client = options.client ?? initClient();

  const { deletedSpaceIds } = await cleanUpTestSpaces({
    client,
    ...options,
  });

  for (const space of options.spaces) {
    if (!deletedSpaceIds.includes(space)) {
      await cleanUpTestEnvironments({
        spaceId: space,
        client,
        ...options,
      });
    }
  }
}
