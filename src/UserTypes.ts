import { objectType } from 'nexus';
import { PostTypes } from './PostTypes';

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('username');
    t.string('createdAt');
    t.string('email');
    t.string('password');
    t.list.field('posts', {
      type: PostTypes
    })
  },
});