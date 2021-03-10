import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import NoteTypeType from './NoteTypeType.gql';

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
  }),
});

export default NoteInputType;