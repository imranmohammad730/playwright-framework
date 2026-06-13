import { test, expect } from '../../src/fixtures/test-fixtures';
import { testData } from '../../src/utils/test-data';

test.describe('Users API @regression', () => {
  test('creates a user and reads it back', async ({ apiClient }) => {
    const newUser = testData.user();

    const created = await apiClient.createUser({
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
    });

    expect(created.id).toBeDefined();
    expect(created.email).toBe(newUser.email);

    const fetched = await apiClient.getUser(created.id);
    expect(fetched.id).toBe(created.id);
    expect(fetched.email).toBe(newUser.email);

    // Cleanup
    await apiClient.deleteUser(created.id);
  });

  test('returns the authenticated profile', async ({ apiClient }) => {
    const profile = await apiClient.getProfile();
    expect(profile.email).toBeDefined();
    expect(profile.id).toBeDefined();
  });

  test('rejects creating a user with an invalid email', async ({ apiClient }) => {
    await expect(
      apiClient.createUser({ email: 'not-an-email', password: 'whatever-1234' })
    ).rejects.toThrow();
  });
});
