import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import * as express from 'express';
import { Request } from 'express';
import { APP_CONSTANTS } from 'utils/constants';

/**
 * Method to get request validator type based on the parameter.
 *
 */
function getRequestValidator(parameter: string, request: Request) {
  let requestValidator;
  switch (parameter) {
    case APP_CONSTANTS.body:
      requestValidator = request.body;
      break;
    case APP_CONSTANTS.params:
      requestValidator = request.params;
      break;
    case APP_CONSTANTS.query:
      requestValidator = request.query;
      break;
    case APP_CONSTANTS.file:
      requestValidator = request.file || {};
      break;
  }
  return requestValidator;
}

/**
 * Middleware to validate the request.
 * Validations are performed using class validator
 */
function validationMiddleware(type: any, parameter: string, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    const requestValidator = getRequestValidator(parameter, req);
    const requestBody = plainToClass(type, requestValidator);
    validate(requestBody, { skipMissingProperties, forbidUnknownValues: true, whitelist: true }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          next(
            new HttpException(
              'ValidateError',
              StatusCode.BadRequest.status,
              'Validation failed error',
              StatusCode.BadRequest.name
            )
          );
        } else {
          // whitelist only in body of the request
          if (APP_CONSTANTS.body === parameter) {
            req.body = requestBody;
          }
          next();
        }
      }
    );
  };
}

export { validationMiddleware };
