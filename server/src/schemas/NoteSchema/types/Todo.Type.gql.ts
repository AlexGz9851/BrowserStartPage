import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    content: {
      type: GraphQLString,
    },
    done: {
      type: GraphQLBoolean,
    }
  }),
});

export default TodoType;