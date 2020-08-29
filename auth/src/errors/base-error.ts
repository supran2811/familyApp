export abstract class BaseError extends Error {
  abstract statusCode: number;

  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
  abstract serialize(): { message: string; field?: string }[];
}
