import { objectType } from 'nexus';
import { UserType } from './UserTypes';

export const PostTypes = objectType({
  name: 'PostType',
  definition(t) {
    t.string('id');
    t.string('userId');
    t.string('title');
    t.string('content');
    t.float('createdAt');
    t.field('user', {
      type: UserType,
    })
  },
});
