import { Request, Response, NextFunction } from 'express';
import { BaseError } from './errors/base-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('error ', err);
  if (err instanceof BaseError) {
    // console.log('coming here!!');
    return res.status(err.statusCode).send({
      errors: err.serialize(),
    });
  }
  console.error(err);
  res.status(500).send({
    errors: [{ message: 'Something went wrong!!' }],
  });
};
