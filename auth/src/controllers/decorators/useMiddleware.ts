import { RequestHandler } from 'express';
import 'reflect-metadata';
import { MetadataKeys } from './constants';

export function useMiddleware(middleware: RequestHandler) {
  return function (target: any, key: string) {
    const middlewares =
      Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, key) || [];

    Reflect.defineMetadata(
      MetadataKeys.MIDDLEWARE,
      [...middlewares, middleware],
      target,
      key
    );
  };
}
