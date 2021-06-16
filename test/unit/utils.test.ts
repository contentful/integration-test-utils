import { generateRandomIdWithPrefix, sleep } from '../../src/utils';

describe('utils', () => {
  describe('generateRandomIdWithPrefix', () => {
    it('generates id without prefix if no prefix given', () => {
      const randomId = generateRandomIdWithPrefix();
      expect(typeof randomId).toEqual('string');
    });

    it('generates an id with a given prefix', () => {
      const prefix = 'some-prefix';
      const randomId = generateRandomIdWithPrefix(prefix);
      expect(randomId.startsWith(prefix)).toBe(true);
    });
  });

  describe('sleep', () => {
    it('resolves after the given amount of time', async () => {
      const delay = 1000;
      const before = new Date().getTime();
      await sleep(delay);
      const after = new Date().getTime();
      expect(after - before).toBeGreaterThanOrEqual(delay);
    });
  });
});
