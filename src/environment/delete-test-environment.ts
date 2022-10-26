import { ClientAPI } from 'contentful-management';

export async function deleteTestEnvironment(
  client: ClientAPI,
  spaceId: string,
  environmentId: string
): Promise<void> {
  try {
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    await environment.delete();
    console.log(`Deleted environment ${environmentId}`);
  } catch (e) {
    console.log((e as Error).name, (e as Error).message);
    console.error(
      `Error deleting environment ${environmentId} with error "${
        (e as Error).message
      }"`
    );
  }
}
