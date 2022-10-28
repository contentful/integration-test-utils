import { cleanUpTestEnvironments } from './environment/clean-up-test-environments';

type CleanUpSpacesOptions = {
  spaces: string[],
  regex?: RegExp,
  threshold?: number;
  dryRun?: boolean;
};

export async function cleanUp(options: CleanUpSpacesOptions) {
  for (const space of options.spaces) {
    await cleanUpTestEnvironments({
      spaceId: space,
      ...options
    })
  }
}
