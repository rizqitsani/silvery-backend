import path from 'path';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CreateProductDto, UpdateProductDto } from '@/interfaces/product';
import ProductPhoto from '@/models/product-photo.model';
import Product from '@/models/product.model';
import { deleteFile } from '@/utils/file';

@Service()
export default class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
  ) {}

  async getAll() {
    const products = await this.productRepository.find({
      relations: ['photos'],
    });
    return products;
  }

  async findById(id: string) {
    const product = await this.productRepository.findOneOrFail(id, {
      relations: ['photos'],
    });

    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    createProductFiles: Express.Multer.File[],
  ) {
    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      description: createProductDto.description,
      stock: createProductDto.stock,
      available: createProductDto.available === 'true',
    });

    const productPhotos: ProductPhoto[] = [];

    createProductFiles.map((file) =>
      productPhotos.push(
        this.productPhotoRepository.create({
          photo_link: file.filename,
        }),
      ),
    );

    product.photos = productPhotos;

    await this.productRepository.save(product);

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    updatedProductFiles: Express.Multer.File[],
  ) {
    const product = await this.findById(id);

    product.name = updateProductDto.name;
    product.price = updateProductDto.price;
    product.description = updateProductDto.description;
    product.stock = updateProductDto.stock;
    product.available = updateProductDto.available === 'true';

    if (updatedProductFiles.length > 0) {
      await this.productPhotoRepository.remove(product.photos);

      await Promise.all(
        product.photos.map(
          async (photo) =>
            await deleteFile(
              path.join(__dirname, '../../uploads/images', photo.photo_link),
            ),
        ),
      );

      // Add new photos
      const productPhotos: ProductPhoto[] = [];

      updatedProductFiles.map((file) =>
        productPhotos.push(
          this.productPhotoRepository.create({
            photo_link: file.filename,
          }),
        ),
      );

      product.photos = productPhotos;
    }

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    const product = await this.findById(id);

    await Promise.all(
      product.photos.map(
        async (photo) =>
          await deleteFile(
            path.join(__dirname, '../../uploads/images', photo.photo_link),
          ),
      ),
    );

    return await this.productRepository.remove(product);
  }
}
