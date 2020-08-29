import { BaseError } from './base-error';
import { HTTP_CODE } from '../constants/app-constant';

export class AuthenticationError extends BaseError {
  statusCode = HTTP_CODE.HTTP_UNAUTHORISED;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serialize() {
    return [{ message: this.msg }];
  }
}
