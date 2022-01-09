import { Application } from 'express';
import request from 'supertest';

import connection from '@/tests/utils/database';
import { UserSeeder } from '@/tests/utils/seeders';
import createServer from '@/tests/utils/server';

describe('/api/v1/auth', () => {
  let app: Application;

  beforeAll(async () => {
    app = await createServer();
    await UserSeeder.run();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('POST: /register should return 400 if email already used', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'test@mail.com',
      full_name: 'Test',
      password: 'password',
      telephone: '+628123456789',
      address: 'Test Street',
      role: 'user',
    });

    expect(response.status).toEqual(400);
  });

  it('POST: /login should return 401 if password do not match', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'test@mail.com',
      password: 'wrongpassword',
    });

    expect(response.status).toEqual(401);
  });

  it('POST: /login should return jwt and set refresh token cookie if credentials matched', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'test@mail.com',
      password: 'password',
    });

    expect(response.status).toEqual(200);
    expect(response.headers['set-cookie'][0].includes('refresh_token='));
    expect(response.headers['set-cookie'][0].includes('HttpOnly'));
    expect(response.headers['set-cookie'][0].includes('Max-Age=86400;'));
    expect(response.body.data).toEqual({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('POST: /refresh-token should return new jwt token', async () => {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'test@mail.com',
      password: 'password',
    });

    const refreshToken = loginResponse.body.data.refreshToken;

    const response = await request(app)
      .post('/api/v1/auth/refresh-token')
      .set(
        'Cookie',
        `refresh_token=${refreshToken}; Max-Age=86400; Path=/; Expires=Mon, 10 Jan 2022 05:09:44 GMT; HttpOnly`,
      );

    expect(response.status).toEqual(200);
    expect(response.body.data).toEqual({
      token: expect.any(String),
    });
  });
});
