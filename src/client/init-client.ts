import { createClient, PlainClientAPI } from 'contentful-management';
import { MissingCredentialError } from '../errors';

const params: { host?: string; insecure?: boolean } = {};

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000';
  params.insecure = true;
}

export function initClient(): PlainClientAPI {
  const accessToken = process.env.CONTENTFUL_INTEGRATION_TEST_CMA_TOKEN;
  if (!accessToken) {
    throw new MissingCredentialError('CONTENTFUL_INTEGRATION_TEST_CMA_TOKEN');
  }
  return createClient(
    {
      accessToken,
      ...params,
    },
    {
      type: 'plain',
    }
  );
}
