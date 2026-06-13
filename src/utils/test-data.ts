import { faker } from '@faker-js/faker';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface TestOrganization {
  name: string;
  slug: string;
  industry: string;
}

/**
 * Generates randomized but realistic test data.
 * Always use this instead of hardcoded values to keep tests independent.
 */
export const testData = {
  user(overrides: Partial<TestUser> = {}): TestUser {
    return {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 14, memorable: false, prefix: 'Aa1!' }),
      name: faker.person.fullName(),
      username: faker.internet.userName().toLowerCase(),
      ...overrides,
    };
  },

  organization(overrides: Partial<TestOrganization> = {}): TestOrganization {
    const name = faker.company.name();
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      industry: faker.commerce.department(),
      ...overrides,
    };
  },

  /**
   * Returns a stable id useful for tagging records created in a test run,
   * so test data is easy to identify and clean up later.
   */
  runId(): string {
    return `qa-${Date.now()}-${faker.string.alphanumeric(6)}`;
  },
};
