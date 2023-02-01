import { JwtPayload } from 'jsonwebtoken';

export interface RefreshTokenPayload extends JwtPayload {
  email: string;
  _id: string;
  isAdmin: boolean;
}
