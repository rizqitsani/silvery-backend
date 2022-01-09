import { getConnection } from 'typeorm';

import Cart from '@/models/cart.model';
import Product from '@/models/product.model';
import Transaction, { ShippingStatusRole } from '@/models/transaction.model';
import User, { UserRole } from '@/models/user.model';

export class UserSeeder {
  static async run(): Promise<User> {
    const em = getConnection().createEntityManager();
    const user = new User();

    user.id = '0767f1e3-7f22-468e-839c-18e7bb92f489';
    user.email = 'test@mail.com';
    user.full_name = 'Test';
    user.telephone = '+628123456789';
    user.address = 'Test';
    user.role = UserRole.USER;
    user.password = 'password';

    return await em.save(user);
  }
}

export class ProductSeeder {
  static async run(): Promise<Product> {
    const em = getConnection().createEntityManager();
    const product = new Product();

    product.id = '77925d3b-fd4b-4bea-8a49-7e97cf6192eb';
    product.name = 'Test';
    product.description = 'Test';
    product.price = 10000;
    product.stock = 10;
    product.available = false;

    return await em.save(product);
  }
}

export class CartSeeder {
  static async run(): Promise<Cart> {
    const em = getConnection().createEntityManager();
    const product = await em.findOneOrFail(
      Product,
      '77925d3b-fd4b-4bea-8a49-7e97cf6192eb',
    );

    const user = await em.findOneOrFail(
      User,
      '0767f1e3-7f22-468e-839c-18e7bb92f489',
    );

    const cart = new Cart();

    cart.id = '77925d3b-fd4b-4bea-8a49-7e97cf6192eb';
    cart.product = product;
    cart.user = user;
    cart.quantity = 1;

    return await em.save(cart);
  }
}

export class TransactionSeeder {
  static async run(): Promise<Transaction> {
    const em = getConnection().createEntityManager();

    const user = await em.findOneOrFail(
      User,
      '0767f1e3-7f22-468e-839c-18e7bb92f489',
    );

    const transaction = new Transaction();

    transaction.id = 'IP59HFTBV3';
    transaction.user = user;
    transaction.total = 10000;
    transaction.shipping_cost = 22000;
    transaction.insurance_cost = 1200;
    transaction.shipping_status = ShippingStatusRole.WAITING_FOR_PAYMENT;
    transaction.transaction_time = new Date();
    transaction.settlement_time = new Date();

    return await em.save(transaction);
  }
}
