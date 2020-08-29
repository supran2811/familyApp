import { ValidationChain } from 'express-validator';
import 'reflect-metadata';
import { MetadataKeys } from './constants';

export function validator(...validators: ValidationChain[]) {
  return function (target: any, key: string) {
    const oldValidators =
      Reflect.getMetadata(MetadataKeys.VALIDATORS, target, key) || [];
    Reflect.defineMetadata(
      MetadataKeys.VALIDATORS,
      [...oldValidators, ...validators],
      target,
      key
    );
  };
}
