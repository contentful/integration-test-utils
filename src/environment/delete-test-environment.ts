import { PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

export async function deleteTestEnvironment(
  spaceId: string,
  environmentId: string,
  client?: PlainClientAPI
): Promise<void> {
  try {
    client = client ?? initClient();

    const environment = await client.environment.delete({
      spaceId,
      environmentId,
    });
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
