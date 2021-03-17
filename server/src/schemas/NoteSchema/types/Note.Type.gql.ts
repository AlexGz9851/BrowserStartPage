import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import DateType from '../../common_types/Date.Type.gql';
import NoteTypeType from './NoteType.Type.gql';
import TodoType from './Todo.Type.gql';

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    _id: {
      type: GraphQLNonNull(GraphQLString),
    },
    type: {
      type: GraphQLNonNull(NoteTypeType),
    },
    content: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    todo: {
      type: GraphQLList(TodoType),
    },
    posX: {
      type: GraphQLNonNull(GraphQLString)
    },
    posY: {
      type: GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: GraphQLNonNull(DateType)
    },
    updatedAt: {
      type: GraphQLNonNull(DateType)
    }
  }),
});

export default NoteType;