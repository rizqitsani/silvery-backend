import { EntityNotFoundError } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { CreateProductDto } from '@/interfaces/product';
import { UserRegisterDto } from '@/interfaces/user';
import { UserRole } from '@/models/user.model';
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import UserService from '@/services/user.service';
import connection from '@/tests/utils/database';

describe('Cart service', () => {
  beforeAll(async () => {
    await connection.create();
  });

  beforeEach(async () => {
    await connection.migrate();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Create should store cart items in database', async () => {
    const cartService = Container.get(CartService);
    const productService = Container.get(ProductService);
    const userService = Container.get(UserService);

    const userDto: UserRegisterDto = {
      email: 'test@mail.com',
      full_name: 'Test',
      password: 'password',
      telephone: '+628123456789',
      address: 'Test Street',
      role: UserRole.USER,
    };

    const productDto: CreateProductDto = {
      name: 'Test',
      description: 'Test',
      price: 10000,
      stock: 10,
      available: 'false',
    };

    const productPhotos = [
      { filename: 'imagetest_1641117524945.png' },
    ] as Express.Multer.File[];

    const product = await productService.createProduct(
      productDto,
      productPhotos,
    );
    const user = await userService.createUser(userDto);

    const result = await cartService.createCart(user.id, product.id);
    const searchResult = await cartService.findByUserAndProductId(
      user.id,
      product.id,
    );

    if (searchResult) {
      expect(searchResult.id).toEqual(result.id);
      expect(searchResult.quantity).toEqual(1);
    } else {
      fail('Could not find cart');
    }
  });

  test('Create should throw error if the product is not found', async () => {
    const cartService = Container.get(CartService);
    const userService = Container.get(UserService);

    const userDto: UserRegisterDto = {
      email: 'test@mail.com',
      full_name: 'Test',
      password: 'password',
      telephone: '+628123456789',
      address: 'Test Street',
      role: UserRole.USER,
    };

    const user = await userService.createUser(userDto);
    await expect(cartService.createCart(user.id, '123')).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
