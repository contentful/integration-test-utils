import { PlainClientAPI } from 'contentful-management';
import { initClient } from './client/init-client';
import { cleanUpTestEnvironments } from './environment/clean-up-test-environments';

type CleanUpSpacesOptions = {
  client?: PlainClientAPI;
  spaces: string[];
  regex?: RegExp;
  threshold?: number;
  dryRun?: boolean;
};

export async function cleanUp(options: CleanUpSpacesOptions) {
  const client = options.client ?? initClient();
  for (const space of options.spaces) {
    await cleanUpTestEnvironments({
      spaceId: space,
      client,
      ...options,
    });
  }
}
