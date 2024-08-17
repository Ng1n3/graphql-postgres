import { objectType } from "nexus";

export const GetmeType = objectType({
  name: 'GetMeType',
  definition(t) {
    t.string('userId')
  },
})