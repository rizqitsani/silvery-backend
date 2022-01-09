import { Application } from 'express';
import request from 'supertest';

import snap from '@/config/midtrans';
import connection from '@/tests/utils/database';
import {
  CartSeeder,
  ProductSeeder,
  TransactionSeeder,
  UserSeeder,
} from '@/tests/utils/seeders';
import createServer from '@/tests/utils/server';

describe('/api/v1/transaction', () => {
  let app: Application;

  let token: string;

  beforeAll(async () => {
    app = await createServer();

    await UserSeeder.run();
    await ProductSeeder.run();

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'test@mail.com',
      password: 'password',
    });

    token = response.body.data.token;
  });

  afterAll(async () => {
    await connection.close();
  });

  it('POST: /token should return 404 if cart is empty', async () => {
    const response = await request(app)
      .post('/api/v1/transaction/token')
      .set('Authorization', `Bearer ${token}`)
      .send({ total: 10000, shipping: 22000, insurance: 1200, type: '' });

    expect(response.statusCode).toBe(404);
  });

  it('POST: /token should return midtrans token and transaction id if cart is not empty', async () => {
    await CartSeeder.run();

    const createTransactionMock = jest
      .spyOn(snap, 'createTransaction')
      .mockResolvedValueOnce({ token: 'mock-midtrans-token' });
    // .mockReturnValueOnce(Promise.resolve({ token: 'mock-midtrans-token' }));

    const response = await request(app)
      .post('/api/v1/transaction/token')
      .set('Authorization', `Bearer ${token}`)
      .send({ total: 10000, shipping: 22000, insurance: 1200, type: '' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual({
      token: 'mock-midtrans-token',
      id: expect.any(String),
    });

    createTransactionMock.mockRestore();
  });

  it('POST: /notification should return 200 and remove user cart', async () => {
    await CartSeeder.run();
    const transaction = await TransactionSeeder.run();

    const updateTransactionStatusDto = {
      order_id: transaction.id,
      transaction_id: '9aed5972-5b6a-401e-894b-a32c91ed1a3a',
      payment_type: 'bank_transfer',
      transaction_status: 'settlement',
      settlement_time: new Date(),
      fraud_status: 'accept',
      transaction_time: new Date(),
    };

    const { transaction: midtransTransaction } = snap;

    const notificationMock = jest
      .spyOn(midtransTransaction, 'notification')
      .mockResolvedValueOnce(updateTransactionStatusDto);

    const response = await request(app)
      .post('/api/v1/transaction/notification')
      .send(updateTransactionStatusDto);

    expect(response.statusCode).toBe(200);

    notificationMock.mockRestore();
  });
});
