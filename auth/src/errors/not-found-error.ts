import { BaseError } from './base-error';
import { HTTP_CODE } from '../constants/app-constant';

export class NotFoundError extends BaseError {
  statusCode = HTTP_CODE.HTTP_NOT_FOUND;
  constructor() {
    super('URL not found');
  }

  serialize() {
    return [{ message: 'URL not found' }];
  }
}
