import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptPromise = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptPromise(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, supplierPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptPromise(supplierPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
