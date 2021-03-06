import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import NoteTypeType from './NoteTypeType.gql';

const NoteType = new GraphQLObjectType({
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

export default NoteType;