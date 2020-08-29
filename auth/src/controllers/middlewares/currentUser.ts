import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface User {
  name: string;
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export function currentUser(req: Request, res: Response, next: NextFunction) {
  const { jwt: jwtToken } = req.session || {};
  if (jwtToken) {
    const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as User;
    req.currentUser = payload;
  }
  next();
}
