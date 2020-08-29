import { BaseError } from './base-error';
import { ValidationError } from 'express-validator';
import { HTTP_CODE } from '../constants/app-constant';

export class RequestValidationError extends BaseError {
  statusCode = HTTP_CODE.HTTP_BAD_REQUEST;

  constructor(private errors: ValidationError[]) {
    super('');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize() {
    return this.errors.map((err) => ({ message: err.msg, field: err.param }));
  }
}
