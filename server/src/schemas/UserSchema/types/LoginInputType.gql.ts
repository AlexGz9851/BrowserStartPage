import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql';

const LoginInputType = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLNonNull(GraphQLString)
    }
  }),
});

export default LoginInputType;