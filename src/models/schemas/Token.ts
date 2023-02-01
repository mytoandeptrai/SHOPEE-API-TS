import { Token } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const TokenSchema = new Schema<Token>(
  { refreshToken: { type: String, unique: true } },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const TokenModel: Model<Token> = model<Token>(MODELS.token, TokenSchema, MODELS.token);
export default TokenModel;
