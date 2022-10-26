import { Space } from 'contentful-management/types';
import {
  DEFAULT_SPACE_DELETION_THRESHOLD,
  TEST_SPACE_PREFIX,
} from '../constants';
import { initClient } from '../client/init-client';
import { cleanUpSpace } from './clean-up-test-space';

type CleanUpSpacesOptions = {
  threshold?: number;
  dryRun?: boolean;
  deleteEnvironments?: boolean;
};

type CleanUpSpacesFunction = (options?: CleanUpSpacesOptions) => Promise<void>;

export const cleanUpTestSpaces: CleanUpSpacesFunction = async options => {
  const { threshold, dryRun } = {
    threshold: DEFAULT_SPACE_DELETION_THRESHOLD,
    dryRun: false,
    ...options,
  };
  const client = initClient();
  const spaces = await client.getSpaces();

  const spacesToDelete = filterDeletableSpaces({
    spaces: spaces.items,
    prefix: TEST_SPACE_PREFIX,
    threshold,
  });

  if (spacesToDelete.length === 0) {
    console.log('Found no spaces matching deletion criteria');
  } else {
    console.log(
      `Found ${spacesToDelete.length} spaces matching deletion criteria`
    );

    if (dryRun) {
      console.log("To delete the following spaces, set 'dryRun' to false");
      console.log(
        spacesToDelete.map(space => `space "${space.name}" id:${space.sys.id}`)
      );
    } else {
      await Promise.allSettled(
        spacesToDelete.map(space => cleanUpSpace(client, space.sys.id))
      );
    }
  }
};

type FilterDeletableSpacesParams = {
  spaces: Space[];
  prefix: string;
  threshold: number;
};

function filterDeletableSpaces({
  spaces,
  prefix,
  threshold,
}: FilterDeletableSpacesParams) {
  return spaces.filter(space => {
    return (
      space.name.startsWith(prefix) &&
      Date.parse(space.sys.updatedAt) + threshold < Date.now()
    );
  });
}
