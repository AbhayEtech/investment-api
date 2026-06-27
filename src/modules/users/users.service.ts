import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {}
  create(data: Partial<User>) { return this.users.create(data); }
  findByEmail(email: string, withPassword = false) {
    const query = this.users.findOne({ email: email.toLowerCase() });
    return withPassword ? query.select('+passwordHash') : query;
  }
  async findById(id: string | Types.ObjectId) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  updateById(id: string | Types.ObjectId, data: Partial<User>) { return this.users.findByIdAndUpdate(id, data, { new: true }); }
  adjustWallets(userId: Types.ObjectId, investmentDelta = 0, earningsDelta = 0, withdrawnDelta = 0) {
    return this.users.findByIdAndUpdate(userId, { $inc: { investmentWallet: investmentDelta, earningsWallet: earningsDelta, totalWithdrawn: withdrawnDelta } }, { new: true });
  }
  list() { return this.users.find().sort({ createdAt: -1 }).limit(200); }
}
