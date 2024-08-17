import { intArg, list, queryType, stringArg } from 'nexus';
import {
  INTERNAL_SERVER_ERROR,
  NOT_AUTHENTICATED,
  NOT_FOUND,
} from '../constants';
import { GetAllUsers } from '../GetAllUsersTypes';
import { GetmeType } from '../GetMeTypes';
import { IMyContext } from '../interface';
import { PostTypes } from '../PostTypes';
import { isAuthenticated } from '../utils';

export const Query = queryType({
  definition(t) {
    t.field('hello', {
      type: 'String',
      resolve: () => 'worlds',
    });
    t.field('getMe', {
      type: GetmeType,
      resolve: (_, __, { session }: IMyContext) => {
        if (!isAuthenticated(session)) {
          return new Error(NOT_AUTHENTICATED);
        }
        return {
          userId: session.userId,
        };
      },
    });
    t.field('getUsers', {
      type: list(GetAllUsers),
      resolve: async (_, __, { prisma, session }: IMyContext) => {
        if (!isAuthenticated(session)) {
          return new Error(NOT_AUTHENTICATED);
        }

        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
          },
        });
        return users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }));
      },
    });
    t.list.field('getPosts', {
      type: PostTypes,
      args: {
        skip: intArg({ default: 0 }),
        take: intArg({ default: 5 }),
      },
      resolve: async (_, __, { prisma, session }: IMyContext) => {
        try {
          if (!isAuthenticated(session)) {
            return new Error(NOT_AUTHENTICATED);
          }

          const posts = await prisma.post.findMany({
            select: {
              content: true,
              id: true,
              createdAt: true,
              user: {
                select: {
                  username: true,
                  id: true,
                },
              },
            },
          });
          return posts;
        } catch (error) {
          console.error(error);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
    t.field('getPost', {
      type: PostTypes,
      args: {
        id: stringArg(),
      },
      resolve: async (_, { id }, { prisma, session }: IMyContext) => {
        try {
          if (!isAuthenticated(session)) {
            return new Error(NOT_AUTHENTICATED);
          }

          const post = await prisma.post.findUnique({
            where: { id },
            select: {
              content: true,
              title: true,
              id: true,
              createdAt: true,
              user: {
                select: {
                  username: true,
                  id: true,
                },
              },
            },
          });
          if (!post) {
            return new Error(NOT_FOUND);
          }
          return post;
        } catch (error) {
          console.error(error);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
  },
});
