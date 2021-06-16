import { initClient } from '../../src/client/init-client';
import { MissingCredentialError } from '../../src/errors';

describe('initClient', () => {
  it('throws an error if necessary environment variable is missing', () => {
    let error;
    try {
      initClient();
    } catch (e) {
      error = e;
    }
    const hasCredentialsEnv = !!process.env
      .CONTENTFUL_INTEGRATION_TEST_CMA_TOKEN;
    const throwsMissingCredientialError =
      error && error instanceof MissingCredentialError;

    expect(hasCredentialsEnv).toEqual(!throwsMissingCredientialError);
  });
});
