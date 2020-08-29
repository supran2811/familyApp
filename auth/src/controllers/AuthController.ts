import { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { controller, post, validator, useMiddleware, get } from './decorators';
import { validateRequest } from './middlewares/validateRequest';
import User from '../models/user';
import { Password } from '../service/password';
import { BadRequestError } from '../errors/bad-request-error';
import { AuthenticationError } from '../errors/auth-error';
import { HTTP_CODE } from '../constants/app-constant';
import messages from '../messages';
import { currentUser } from './middlewares/currentUser';

@controller('/api/users')
export class AuthController {
  @post('/signup')
  @validator(
    body('email').isEmail().withMessage(messages.ENTER_VALID_EMAIL),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(messages.ENTER_VALID_PASSWORD)
  )
  @useMiddleware(validateRequest)
  async signup(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(messages.USER_ALREADY_EXIST);
    }

    const hashedPassword = await Password.toHash(password);
    const user = User.build({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email,
        name: user.name,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(HTTP_CODE.HTTP_CREATED).send({});
  }

  @post('/signin')
  @validator(
    body('email').isEmail().withMessage(messages.ENTER_VALID_EMAIL),
    body('password').notEmpty().withMessage(messages.PASSWORD_REQUIRED)
  )
  @useMiddleware(validateRequest)
  async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError(messages.USER_NOT_FOUND);
    }

    const isValidPassword = await Password.compare(user.password, password);

    if (!isValidPassword) {
      throw new AuthenticationError(messages.INVALID_PASSWORD);
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        email,
        name: user.name,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(HTTP_CODE.HTTP_OK).send({});
  }

  @post('/signout')
  signout(req: Request, res: Response) {
    req.session = null;
    res.status(HTTP_CODE.HTTP_OK).send({});
  }

  @get('/currentuser')
  @useMiddleware(currentUser)
  currentUser(req: Request, res: Response) {
    res.send(req.currentUser || {});
  }
}
