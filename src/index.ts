import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import express, { Application } from 'express';
import { getSchema } from './graphql/schema';
import bodyParser from 'body-parser'

const app: Application = express();
app.use(bodyParser.json())

const main = async () => {
  const schema = getSchema();

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
