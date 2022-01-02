import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import Cart from '@/models/cart.model';
import ProductService from '@/services/product.service';
import UserService from '@/services/user.service';

@Service()
export default class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @Inject() private productService: ProductService,
    @Inject() private userService: UserService,
  ) {}

  async findByUserId(userId: string) {
    const cartItems = await this.cartRepository.find({
      relations: ['product', 'product.photos'],
      where: { user: { id: userId } },
    });

    return cartItems;
  }

  async findByUserAndProductId(userId: string, productId: string) {
    const cart = await this.cartRepository.findOneOrFail({
      where: { user: { id: userId }, product: { id: productId } },
    });

    return cart;
  }

  async createCart(userId: string, productId: string) {
    const user = await this.userService.findById(userId);
    const product = await this.productService.findById(productId);

    const cart = this.cartRepository.create({
      quantity: 1,
    });

    cart.product = product;
    cart.user = user;

    await this.cartRepository.save(cart);

    return cart;
  }

  async updateCart(userId: string, productId: string, quantity: number) {
    const cart = await this.findByUserAndProductId(userId, productId);
    cart.quantity = quantity;

    return await this.cartRepository.save(cart);
  }

  async deleteCart(userId: string, productId: string) {
    const cart = await this.findByUserAndProductId(userId, productId);

    return await this.cartRepository.remove(cart);
  }

  async deleteCartByUserId(userId: string) {
    const cart = await this.findByUserId(userId);

    return await this.cartRepository.remove(cart);
  }

  calculateCartTotal(cartItems: Cart[]) {
    return cartItems.reduce(
      (prev, current) => prev + current.product.price * current.quantity,
      0,
    );
  }
}

module.exports = CartService;
