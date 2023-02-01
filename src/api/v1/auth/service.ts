import config from 'config';
import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenModel, UserModel } from 'models';
import { Token, User } from 'models/types';
import { RefreshTokenPayload } from 'types/auth';

const generateAccessToken = (user: User) => {
  const accessToken = jwt.sign({ _id: user._id, email: user.email, role: user.role }, config.jwt.jwtAccessTokenSecret, {
    expiresIn: config.jwt.expiredAccessToken,
  });
  return accessToken;
};

const generateRefreshToken = (user: User) => {
  const refreshToken = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    config.jwt.jwtRefreshTokenSecret,
    {
      expiresIn: config.jwt.expiredRefreshToken,
    }
  );
  return refreshToken;
};

const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    const secret = config.jwt.jwtRefreshTokenSecret;
    jwt.verify(refreshToken, secret, (err, payload) => {
      if (err) reject(err);
      return resolve(payload);
    });
  });
};

const signUp = async (user: User, next: NextFunction) => {
  const { email } = user;
  try {
    const userInDb = await UserModel.findOne({ email }).exec();

    if (userInDb) {
      throw new HttpException(
        'CreateError',
        StatusCode.BadRequest.status,
        'Username is aready',
        StatusCode.BadRequest.name
      );
    }

    const newUser = new UserModel(user);
    const result = await newUser.save();

    return {
      ...result.toObject(),
      password: '',
      message: 'Đăng ký thành công',
    };
  } catch (error) {
    next(error);
  }
};

const signIn = async (user: User, next: NextFunction) => {
  try {
    const { email, password } = user;

    const userInDB = await UserModel.findOne({ email });
    if (!userInDB) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'User not registered!',
        StatusCode.NotFound.name
      );
    }

    const isValid = await userInDB.schema.methods.isCheckPassword(password, userInDB);
    if (!isValid) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Unauthorized.status,
        'Incorrect password',
        StatusCode.Unauthorized.name
      );
    }

    const accessToken = generateAccessToken(userInDB);
    const refreshToken = generateRefreshToken(userInDB);
    await TokenModel.create({ refreshToken });

    return {
      ...userInDB.toObject(),
      accessToken,
      refreshToken,
      message: 'Đăng nhập thành công!',
    };
  } catch (error) {
    next(error);
  }
};

const requestRefreshToken = async (token: Token, next: NextFunction) => {
  try {
    if (!token) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'Missing refreshToken',
        StatusCode.NotFound.name
      );
    }

    let newAccessToken;
    let newRefreshToken;

    const payload: RefreshTokenPayload | any = await verifyRefreshToken(token.refreshToken);
    if (payload) {
      const deleteRefreshTokenOld = await TokenModel.findOneAndDelete({ refreshToken: token.refreshToken });

      if (!deleteRefreshTokenOld) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.NotFound.status,
          'Refresh token is not available',
          StatusCode.NotFound.name
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...rest } = payload;

      newAccessToken = generateAccessToken(rest);
      newRefreshToken = generateRefreshToken(rest);
      await TokenModel.create({ refreshToken: newRefreshToken });
    }
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: 'Tạo mới access token thành công!',
    };
  } catch (error) {
    next(error);
  }
};

const requestLogout = async (token: Token, next: NextFunction) => {
  try {
    const deleteRefreshToken = await TokenModel.findOneAndDelete({ refreshToken: token.refreshToken }).exec();
    if (!deleteRefreshToken) {
      if (!deleteRefreshToken) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.NotFound.status,
          'Refresh token is not available',
          StatusCode.NotFound.name
        );
      }
    }

    return { message: 'Đăng xuất thành công!' };
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, requestRefreshToken, requestLogout };
