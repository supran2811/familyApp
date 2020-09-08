import mongoose from 'mongoose';

import { server } from './server';
import './controllers';

if (!process.env.MONGO_URI) {
  throw new Error('Mongo uri must be defined in the enviorment variables');
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!!');
  })
  .catch((err) => {
    console.log('Error while connecting to mongo!!');
  });

server.listen(3000, () => {
  console.log('Listening on port 3000!!');
});
