import { PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

type CleanUpSpaceProps = {
  spaceId: string;
  client?: PlainClientAPI;
};

export async function cleanUpSpace(options: CleanUpSpaceProps): Promise<void> {
  try {
    const { client, spaceId } = {
      client: options.client ?? initClient(),
      ...options,
    };
    await client.space.delete({ spaceId });
    console.log(`Deleted space ${spaceId}`);
  } catch (e) {
    console.log((e as Error).name, (e as Error).message);
    console.error(
      `Error deleting space ${options.spaceId} with error "${
        (e as Error).message
      }"`
    );
  }
}
