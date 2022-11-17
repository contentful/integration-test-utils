import { PlainClientAPI } from 'contentful-management';

export const plainApiClient = ({
  space: {
    delete: jest.fn(),
  },
} as unknown) as PlainClientAPI;
