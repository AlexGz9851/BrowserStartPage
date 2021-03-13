import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

const TodoInputType = new GraphQLInputObjectType({
  name: 'TodoInput',
  fields: () => ({
    content: {
      type: GraphQLString,
    },
    done: {
      type: GraphQLBoolean,
    }
  }),
});

export default TodoInputType;