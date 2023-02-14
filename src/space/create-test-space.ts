import { Space } from 'contentful-management/types';
import { PlainClientAPI } from 'contentful-management';
import { TEST_SPACE_PREFIX, SPACE_NAME_MAX_LENGTH } from '../constants';
import { SpaceNameTooLongError, SpaceCreationFailedError } from '../errors';
import { initClient } from '../client/init-client';

type Repo = 'CMA' | 'CDA' | 'Export' | 'Import' | 'Migration' | 'CLI';

export type CreateSpaceParams = {
  client?: PlainClientAPI;
  organizationId: string;
  repo: Repo;
  language: 'JS';
  testSuiteName: string;
};

export async function createTestSpace({
  client,
  organizationId,
  repo,
  language,
  testSuiteName,
}: CreateSpaceParams): Promise<Space> {
  client = client ?? initClient();
  const spaceName = `${TEST_SPACE_PREFIX}${language} ${repo} ${testSuiteName}`;
  if (spaceName.length > SPACE_NAME_MAX_LENGTH) {
    throw new SpaceNameTooLongError(spaceName);
  }

  let space;
  try {
    space = await client.space.create(
      { organizationId },
      {
        name: spaceName,
      }
    );
  } catch (e) {
    console.error(e);
  }
  if (!space) {
    throw new SpaceCreationFailedError(spaceName);
  }
  return space;
}
