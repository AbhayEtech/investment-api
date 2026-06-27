import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from '../../schemas/setting.schema';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private readonly settings: Model<SettingDocument>) {}
  current() {
    return this.settings.findOneAndUpdate({ key: 'default' }, { $setOnInsert: { key: 'default', annualReturnRate: 7, gstRate: 0.5, lockPeriodDays: 3, withdrawalProcessingDays: 4 } }, { upsert: true, new: true });
  }
  async update(data: Partial<Setting>) {
    await this.current();
    return this.settings.findOneAndUpdate({ key: 'default' }, { $set: data }, { new: true });
  }
}
