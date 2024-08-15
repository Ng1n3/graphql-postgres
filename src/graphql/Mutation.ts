import { User } from '@prisma/client';
import { mutationType, stringArg } from 'nexus';
import { IMyContext } from '../interface';
import { hashPassword } from '../utils';

export const Mutation = mutationType({
  definition(t) {
    t.boolean('registerUser', {
      args: {
        name: stringArg(),
        email: stringArg(),
        password: stringArg(),
        username: stringArg(),
      },
      resolve: async (
        _,
        { ...userDetails }: Omit<User, 'id'>,
        { prisma }: IMyContext
      ) => {
        try {
          const hashedPassword = await hashPassword(userDetails.password);
         await prisma.user.create({
            data: { ...userDetails, password: hashedPassword },
          });
          return true;
        } catch (error) {
          console.error('error => ', error);
          const errorCaught: Error = error as Error;
          return new Error(errorCaught.message);
        }
      },
    });

    // t.string('testMutation', {
    //   resolve: () => {
    //     return "Mutation is working!";
    //   },
    // });
    
  },
});
