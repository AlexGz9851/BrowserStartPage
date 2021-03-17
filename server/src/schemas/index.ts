import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import NoteSchema from './NoteSchema/NoteSchema';
import SettingsSchema from './SettingsSchema/SettingsSchema';
import UserSchema from './UserSchema/UserSchema';

const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => Object.assign(
      UserSchema.query,
      SettingsSchema.query,
      NoteSchema.query
    )
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => Object.assign(
      UserSchema.mutation,
      SettingsSchema.mutation,
      NoteSchema.mutation
    )
  }),
  // subscription: new GraphQLObjectType({
  //     name: 'Subscription',
  //     fields: () => Object.assign(
  //         UserSchema.subscription,
  //         ProductSchema.subscription,
  //     )
  // }),
  types: [
    ...UserSchema.types,
    ...SettingsSchema.types,
    ...NoteSchema.types
  ]
});

export default graphqlSchema;