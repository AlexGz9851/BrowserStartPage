import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import NoteTypeType from './NoteTypeType.gql';

const NoteInputType = new GraphQLInputObjectType({
  name: 'Note',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString),
    },
    type: {
      type: GraphQLNonNull(NoteTypeType),
    },
    content: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
});

export default NoteInputType;