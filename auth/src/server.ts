import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@familyapp/common';

const server = express();

server.set('trust proxy', true);

const router = express.Router();

server.use(json({}));
server.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

server.use(router);

server.use(errorHandler);

server.all('*', () => {
  throw new NotFoundError();
});

export { server, router };
