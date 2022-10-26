import { cleanUpTestSpaces } from './space/clean-up-test-spaces';

type CleanUpSpacesOptions = {
  threshold?: number;
  dryRun?: boolean;
};

export async function cleanUp(options: CleanUpSpacesOptions) {
  return cleanUpTestSpaces({
    ...options,
    deleteEnvironments: true,
  });
}
