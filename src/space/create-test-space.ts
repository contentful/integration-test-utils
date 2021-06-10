import { Space } from 'contentful-management/types';
import { ClientAPI } from 'contentful-management';
import { TEST_SPACE_PREFIX, SPACE_NAME_MAX_LENGTH } from '../constants';
import { SpaceNameTooLongError, SpaceCreationFailedError } from '../errors';

type Repo = 'CMA' | 'CDA' | 'Export' | 'Import' | 'Migration' | 'CLI';

export type CreateSpaceParams = {
  client: ClientAPI;
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
  const spaceName = `${TEST_SPACE_PREFIX}${language} ${repo} ${testSuiteName}`;
  if (spaceName.length > SPACE_NAME_MAX_LENGTH) {
    throw new SpaceNameTooLongError(spaceName);
  }

  let space;
  try {
    space = await client.createSpace(
      {
        name: spaceName,
      },
      organizationId
    );
  } catch (e) {
    console.error(e);
  }
  if (!space) {
    throw new SpaceCreationFailedError(spaceName);
  }
  return space;
}
