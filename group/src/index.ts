import mongoose from 'mongoose';

import { server } from './server';
import { natsWrapper } from './nats-wrapper';
import './controllers';
import { initListeners } from './events/listeners';
(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo uri must be defined in the enviorment variables');
  }

  if (
    !process.env.NATS_CLIENT_ID ||
    !process.env.NATS_URL ||
    !process.env.NATS_CLUSTER_ID
  ) {
    throw new Error('Nats server details are missing!!');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    initListeners();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    server.listen(3000, () => {
      console.log('Listening on port 3000!!');
    });
  } catch (error) {
    console.log('Error is thrown while starting server ', error);
    throw error;
  }
})();
