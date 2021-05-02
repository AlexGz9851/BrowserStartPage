import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql';
import DateType from '../../common_types/Date.Type.gql';
import NoteTypeType from './NoteType.Type.gql';
import TodoInputType from './TodoInput.Type.gql';

const NoteInputType = new GraphQLInputObjectType({
  name: 'NoteInput',
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    type: {
      type: NoteTypeType,
    },
    content: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    todo: {
      type: GraphQLList(TodoInputType),
    },
    createdAt: {
      type: DateType
    },
    updatedAt: {
      type: DateType
    },
    width: {
      type: GraphQLString
    }
  }),
});

export default NoteInputType;