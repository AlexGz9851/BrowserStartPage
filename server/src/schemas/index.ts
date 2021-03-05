import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import UserSchema from './UserSchema';
import SettingsSchema from './SettingsSchema';

const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => Object.assign(
      UserSchema.query
    )
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => Object.assign(
      UserSchema.mutation,
      SettingsSchema.mutation
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
    ...SettingsSchema.types
  ]
});

export default graphqlSchema;