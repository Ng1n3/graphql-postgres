import { list, queryType } from 'nexus';
import { INTERNAL_SERVER_ERROR, NOT_AUTHENTICATED } from '../constants';
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
      resolve: async (_, __, { prisma }: IMyContext) => {
        try {
          const posts = await prisma.post.findMany();
          return posts;
        } catch (error) {
          console.error(error);
          return new Error(INTERNAL_SERVER_ERROR);
        }
      },
    });
  },
});
