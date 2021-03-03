import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

// Import each models schema
import UserSchema from './UserSchema';

const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => Object.assign(
      UserSchema.query,
    )
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => Object.assign(
      UserSchema.mutation,
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
  ]
});

export default graphqlSchema;