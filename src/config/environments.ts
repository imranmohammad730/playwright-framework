import 'dotenv/config';

export type Environment = 'dev' | 'staging' | 'production';

export interface EnvironmentConfig {
    name: Environment;
    baseUrl: string;
    apiUrl: string;
    apiKey?: string;
    testUser: {
      email: string;
      password: string;
    };
}

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
          throw new Error(`Missing required env var: ${key}. Check .env or your CI secrets.`);
    }
    return value;
}

function optional(key: string): string | undefined {
    return process.env[key] || undefined;
}

const configs: Record<Environment, EnvironmentConfig> = {
    dev: {
          name: 'dev',
          baseUrl: process.env.DEV_BASE_URL || 'http://localhost:3000',
          apiUrl: (process.env.DEV_BASE_URL || 'http://localhost:3000') + '/api',
          apiKey: optional('DEV_API_KEY'),
          testUser: {
                  email: required('TEST_USER_EMAIL'),
                  password: required('TEST_USER_PASSWORD'),
          },
    },
    staging: {
          name: 'staging',
          baseUrl: required('STAGING_BASE_URL'),
          apiUrl: required('STAGING_BASE_URL') + '/api',
          apiKey: optional('STAGING_API_KEY'),
          testUser: {
                  email: required('TEST_USER_EMAIL'),
                  password: required('TEST_USER_PASSWORD'),
          },
    },
    production: {
          name: 'production',
          baseUrl: required('PRODUCTION_BASE_URL'),
          apiUrl: required('PRODUCTION_BASE_URL') + '/api',
          apiKey: optional('PRODUCTION_API_KEY'),
          testUser: {
                  email: required('TEST_USER_EMAIL'),
                  password: required('TEST_USER_PASSWORD'),
          },
    },
};

export function loadEnvironment(): EnvironmentConfig {
    const envName = (process.env.TEST_ENV || 'dev') as Environment;
    const config = configs[envName];
    if (!config) {
          throw new Error(`Unknown TEST_ENV: ${envName}. Must be one of: dev, staging, production`);
    }
    return config;
}
