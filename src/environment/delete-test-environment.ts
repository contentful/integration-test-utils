import { PlainClientAPI } from 'contentful-management';
import { initClient } from '../client/init-client';

type DeleteTestEnvironmentProps = {
  spaceId: string;
  environmentId: string;
  client?: PlainClientAPI;
};

export async function deleteTestEnvironment(
  options: DeleteTestEnvironmentProps
): Promise<void> {
  try {
    const { spaceId, environmentId, client } = {
      client: options.client ?? initClient(),
      ...options,
    };

    const environment = await client.environment.delete({
      spaceId,
      environmentId,
    });
    await environment.delete();
    console.log(`Deleted environment ${environmentId}`);
  } catch (e) {
    console.log((e as Error).name, (e as Error).message);
    console.error(
      `Error deleting environment ${options.environmentId} with error "${
        (e as Error).message
      }"`
    );
  }
}
