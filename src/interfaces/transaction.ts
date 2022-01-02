export class CreateTransactionDto {
  total: number;
  shipping: number;
  insurance: number;
  type: string;
}

export class UpdateTransactionStatusDto {
  order_id: string;
  transaction_id: string;
  payment_type: string;
  transaction_status: string;
  settlement_time: Date;
  fraud_status: string;
  transaction_time: Date;
}
