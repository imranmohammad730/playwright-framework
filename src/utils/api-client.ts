import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { loadEnvironment } from '../config/environments';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  name?: string;
  password?: string;
}

/**
 * Thin typed wrapper over Playwright's APIRequestContext.
 * Use this for API-only tests and for setting up state in E2E tests.
 */
export class ApiClient {
  private constructor(
    private readonly context: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  static async create(token?: string): Promise<ApiClient> {
    const env = loadEnvironment();
    const context = await playwrightRequest.newContext({
      baseURL: env.apiUrl,
      extraHTTPHeaders: token
        ? { Authorization: `Bearer ${token}` }
        : env.apiKey
          ? { Authorization: `Bearer ${env.apiKey}` }
          : undefined,
    });
    return new ApiClient(context, env.apiUrl);
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.context.post('/auth/login', {
      data: { email, password },
    });
    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }
    const body = await response.json();
    return body.token as string;
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await this.context.post('/users', { data: payload });
    if (!response.ok()) {
      throw new Error(`Create user failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as User;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.context.get(`/users/${id}`);
    if (!response.ok()) {
      throw new Error(`Get user failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as User;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await this.context.delete(`/users/${id}`);
    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Delete user failed: ${response.status()} ${await response.text()}`);
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.context.get('/me');
    if (!response.ok()) {
      throw new Error(`Get profile failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as User;
  }
}
