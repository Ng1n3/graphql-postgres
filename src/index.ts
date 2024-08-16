import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { getMyPrismaCLient } from './db/indext';
import { getSchema } from './graphql/schema';
import { IMyContext } from './interface';
import { isProd } from './utils';

dotenv.config();

const app: Application = express();
const RedisClient = new Redis();

// Create RedisStore
// const RedisStore = RedisSession

app.use(bodyParser.json());
app.use(
  session({
    // store: new RedisStore({ client: RedisClient }),
    store: new RedisStore({client: RedisClient}),
    secret: process.env.SESSION_SECRET!,
    name: 'pgql-api',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: isProd(),
      sameSite: 'lax',
    },
  })
);

const main = async () => {
  const schema = getSchema();
  const prisma = await getMyPrismaCLient();
  const apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer.start();
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }): Promise<IMyContext> => ({
        req,
        res,
        prisma,
        session: req.session,
        redis: RedisClient,
      }),
    })
  );
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});