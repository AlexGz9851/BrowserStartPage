import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

const SignUpInputType = new GraphQLInputObjectType({
  name: 'SignUpInput',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLNonNull(GraphQLString)
    }
  }),
});

export default SignUpInputType;