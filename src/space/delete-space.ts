import { ClientAPI } from 'contentful-management';

export async function deleteSpace(
  client: ClientAPI,
  spaceId: string
): Promise<void> {
  try {
    const space = await client.getSpace(spaceId);
    await space.delete();
    console.log(`Deleted space ${spaceId}`);
  } catch (e) {
    console.log(e.name, e.message);
    console.error(`Error deleting space ${spaceId} with error "${e.message}"`);
  }
}
