import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private readonly transactions: Model<TransactionDocument>) {}
  create(data: Partial<Transaction>) { return this.transactions.create(data); }
  listForUser(userId: Types.ObjectId | string) { return this.transactions.find({ userId }).sort({ createdAt: -1 }).limit(100); }
}
