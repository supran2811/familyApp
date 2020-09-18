import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
      mockUser: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
const mockUserID = mongoose.Types.ObjectId().toHexString();

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  process.env.JWT_KEY = 'sfdsff';
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const coll of collections) {
    await coll.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.mockUser = {
  id: mockUserID,
  email: 'test@test.com',
  name: 'test',
};

global.signin = () => {
  const payload = global.mockUser;

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`];
};
