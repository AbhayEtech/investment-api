import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Roles } from './common/constants';
import { SettingSchema } from './schemas/setting.schema';
import { UserSchema } from './schemas/user.schema';

config({ path: 'backend/.env' });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/investment_platform');
  const User = mongoose.model('User', UserSchema);
  const Setting = mongoose.model('Setting', SettingSchema);
  await Setting.findOneAndUpdate({ key: 'default' }, { key: 'default', annualReturnRate: 7, gstRate: 0.5, lockPeriodDays: 3, withdrawalProcessingDays: 4 }, { upsert: true });
  await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL ?? 'admin@example.com' }, { fullName: 'Super Admin', email: process.env.ADMIN_EMAIL ?? 'admin@example.com', mobileNumber: '9999999999', passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'Admin@12345', 12), role: Roles.SUPER_ADMIN, emailVerified: true, active: true }, { upsert: true });
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
