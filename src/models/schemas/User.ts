import { User } from 'models/types';
import bcypt from 'bcrypt';
import { MODELS } from 'utils/constants/models';
import { model, Model, Schema } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    email: { type: String, unique: true, required: true },
    fullname: { type: String, default: '' },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    street: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    district: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    ward: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    creditCard: {
      number: { type: String, default: '' },
      name: { type: String, default: '' },
      expiry: { type: String, default: '' },
      cvc: { type: String, default: '' },
    },
    role: { type: String, default: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

UserSchema.index({ fullname: 'text' });

UserSchema.pre('save', async function (this: User, next: (err?: Error | undefined) => void) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcypt.genSalt(10);
  const hashPassword = await bcypt.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

UserSchema.method('isCheckPassword', async function (password: string, user: User) {
  try {
    const isCheckPassword = await bcypt.compare(password, user.password);
    return isCheckPassword;
  } catch (error) {
    return false;
  }
});

const UserModel: Model<User> = model<User>(MODELS.user, UserSchema, MODELS.user);
export default UserModel;
