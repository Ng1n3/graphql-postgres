import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import express, { Application, Request, Response } from 'express';
import { getMyPrismaCLient } from './db/indext';
import { getSchema } from './graphql/schema';
import { IMyContext } from './interface';

const app: Application = express();
app.use(bodyParser.json());

const main = async () => {
  const schema = getSchema();
  const prisma = await getMyPrismaCLient();

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();

  // Use the context function in the middleware setup
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req, res }: { req: Request; res: Response }): Promise<IMyContext> => ({
      req,
      res,
      prisma,
    }),
  }));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});


