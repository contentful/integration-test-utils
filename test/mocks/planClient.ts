import { PlainClientAPI } from 'contentful-management';

export function makeMockPlainClient(client: unknown) {
  return (client as unknown) as PlainClientAPI;
}
