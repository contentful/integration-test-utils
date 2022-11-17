import { PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

type DeleteTestSpaceProps = {
  spaceId: string;
  client?: PlainClientAPI;
};

export async function deleteTestSpace(
  options: DeleteTestSpaceProps
): Promise<void> {
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
