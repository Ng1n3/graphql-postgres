import { makeSchema } from 'nexus';
import path from 'path';
import { Mutation } from './Mutation';
import { Query } from './Query';
import { UserType } from '../UserTypes';
import { PostTypes } from '../PostTypes';
import { GetmeType } from '../GetMeTypes';

export const getSchema = () => {
  const schema = makeSchema({
    types: [Query, Mutation, UserType, PostTypes, GetmeType],
    outputs: {
      schema: path.join(process.cwd(), 'nexus', 'schema.graphql'),
      typegen: path.join(process.cwd(), 'nexus', 'nexus.ts'),
    },
  });
  return schema;
};
