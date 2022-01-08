import { EntityNotFoundError } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { CreateProductDto } from '@/interfaces/product';
import ProductService from '@/services/product.service';
import connection from '@/tests/utils/database';

describe('Product service', () => {
  beforeAll(async () => {
    await connection.create();
  });

  beforeEach(async () => {
    await connection.migrate();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Create should store product and its photos in database', async () => {
    const service = Container.get(ProductService);

    const productDto: CreateProductDto = {
      name: 'Test',
      description: 'Test',
      price: 10000,
      stock: 10,
      available: 'false',
    };

    const productPhotos = [
      { filename: 'imagetest_1641117524935.png' },
    ] as Express.Multer.File[];

    const result = await service.createProduct(productDto, productPhotos);
    const searchResult = await service.findById(result.id);

    if (searchResult) {
      expect(searchResult.id).toEqual(result.id);
      expect(searchResult.name).toEqual(productDto.name);
      expect(searchResult.available).toEqual(false);
      expect(searchResult.photos).toHaveLength(productPhotos.length);
      expect(searchResult.photos[0].photo_link).toEqual(
        productPhotos[0].filename,
      );
    } else {
      fail('Could not find product');
    }
  });

  test('Find by ID should throw error if the product is not found', async () => {
    const service = Container.get(ProductService);

    await expect(service.findById('123')).rejects.toThrow(EntityNotFoundError);
  });
});
