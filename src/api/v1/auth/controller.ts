import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';

// @desc    Đăng ký
// @route   POST /v1/auth/sign-up
// @access  Public
const signUp = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.signUp(request.body, next);
  if (result) {
    const message = result.message ?? 'OK';
    new ApiResponse(result, message, 200, Date.now() - request.startTime).send(response);
  }
};

// @desc    Đăng nhập
// @route   POST /v1/auth/sign-in
// @access  Private
const signIn = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.signIn(request.body, next);
  if (result) {
    const message = result.message ?? 'OK';
    new ApiResponse(result, message, 200, Date.now() - request.startTime).send(response);
  }
};

// @desc    Tạo mới accessToken với refreshToken
// @route   POST /v1/auth/refresh-token
// @access  Public
const refreshToken = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.requestRefreshToken(request.body, next);
  if (result) {
    const message = result.message ?? 'OK';
    new ApiResponse(result, message, 200, Date.now() - request.startTime).send(response);
  }
};

// @desc    Đăng xuất
// @route   POST /v1/auth/logout
// @access  Private
const logout = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.requestLogout(request.body, next);
  if (result) {
    const message = result.message ?? 'OK';
    new ApiResponse(result, message, 200, Date.now() - request.startTime).send(response);
  }
};

export { signUp, signIn, refreshToken, logout };
