import { PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

export async function cleanUpSpace(
  spaceId: string,
  client?: PlainClientAPI
): Promise<void> {
  try {
    client = client ?? initClient();
    await client.space.delete({ spaceId });
    console.log(`Deleted space ${spaceId}`);
  } catch (e) {
    console.log((e as Error).name, (e as Error).message);
    console.error(
      `Error deleting space ${spaceId} with error "${(e as Error).message}"`
    );
  }
}
