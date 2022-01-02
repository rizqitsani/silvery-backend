import { StatusCodes } from 'http-status-codes';
import { customAlphabet } from 'nanoid';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import ApiError from '@/errors/ApiError';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from '@/interfaces/transaction';
import TransactionDetail from '@/models/transaction-detail.model';
import Transaction, { ShippingStatusRole } from '@/models/transaction.model';
import User from '@/models/user.model';
import CartService from '@/services/cart.service';

@Service()
export default class TransactionService {
  constructor(
    @Inject() private cartService: CartService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private transactionDetailRepository: Repository<TransactionDetail>,
  ) {}

  async getAll() {
    const transactions = await this.transactionRepository.find({
      relations: ['items', 'items.product', 'items.product.photos'],
      order: {
        transaction_time: 'DESC',
      },
    });

    return transactions;
  }

  async findById(id: string) {
    const transactions = await this.transactionRepository.findOneOrFail({
      relations: ['items', 'items.product', 'items.product.photos', 'user'],
      where: {
        id,
      },
      order: {
        transaction_time: 'DESC',
      },
    });

    return transactions;
  }

  async findByUserId(userId: string) {
    const transactions = await this.transactionRepository.find({
      relations: ['items', 'items.product', 'items.product.photos'],
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        transaction_time: 'DESC',
      },
    });

    return transactions;
  }

  async createTransaction(
    user: User,
    createTransactionDto: CreateTransactionDto,
  ) {
    const generateId = customAlphabet(
      '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      10,
    );

    const cartItems = await this.cartService.findByUserId(user.id);

    if (cartItems.length === 0) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: 'Tidak ada item dalam keranjang!',
      });
    }

    const transaction = this.transactionRepository.create({
      id: generateId(),
      user: user,
      total: createTransactionDto.total,
      transaction_type: createTransactionDto.type,
      shipping_cost: createTransactionDto.shipping,
      insurance_cost: createTransactionDto.insurance,
      shipping_status: ShippingStatusRole.WAITING_FOR_PAYMENT,
    });

    const transactionDetails: TransactionDetail[] = [];

    cartItems.map((item) =>
      transactionDetails.push(
        this.transactionDetailRepository.create({
          product: item.product,
          quantity: item.quantity,
        }),
      ),
    );

    transaction.items = transactionDetails;

    return await this.transactionRepository.save(transaction);
  }

  async updateTransactionStatus(
    updateTransactionStatusDto: UpdateTransactionStatusDto,
  ) {
    const transaction = await this.findById(
      updateTransactionStatusDto.order_id,
    );

    await this.cartService.deleteCartByUserId(transaction.user.id);

    transaction.midtrans_id = updateTransactionStatusDto.transaction_id;
    transaction.payment_type = updateTransactionStatusDto.payment_type;
    transaction.transaction_status =
      updateTransactionStatusDto.transaction_status;
    transaction.shipping_status = updateTransactionStatusDto.settlement_time
      ? ShippingStatusRole.PACKED
      : ShippingStatusRole.WAITING_FOR_PAYMENT;
    transaction.fraud_status = updateTransactionStatusDto.fraud_status;
    transaction.transaction_time = updateTransactionStatusDto.transaction_time;
    transaction.settlement_time = updateTransactionStatusDto.settlement_time;

    return await this.transactionRepository.save(transaction);
  }

  async updateShipmentStatus(id: string, status: ShippingStatusRole) {
    const transaction = await this.findById(id);
    transaction.shipping_status = status;

    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: string) {
    const transaction = await this.findById(id);

    return await this.transactionRepository.remove(transaction);
  }
}
