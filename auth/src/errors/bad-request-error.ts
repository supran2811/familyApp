import { BaseError } from './base-error';
import { HTTP_CODE } from '../constants/app-constant';

export class BadRequestError extends BaseError {
  statusCode = HTTP_CODE.HTTP_BAD_REQUEST;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serialize() {
    return [{ message: this.msg }];
  }
}
