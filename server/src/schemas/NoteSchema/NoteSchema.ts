import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { addNote, getNote, getNotes, removeNote, updateNote } from '../../models/NoteModel';
import NoteType from './types/Note.Type.gql';
import NoteInputType from './types/NoteInput.Type.gql';

const query = {
  notes: {
    type: GraphQLList(NoteType),
    args: {},
    resolve: (root: any, args: any, request: any) => getNotes(request)
  },
  note: {
    type: NoteType,
    args: {
      id: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (root: any, { id }: any, request: any) => getNote(request, id)
  }
};

const mutation = {
  addNote: {
    type: NoteType,
    args: {
      note: { type: NoteInputType }
    },
    resolve: (obj: any, { note }: any, request: any) => addNote(request, note)
  },
  removeNote: {
    type: NoteType,
    args: {
      noteId: { type: GraphQLString }
    },
    resolve: (obj: any, { noteId }: any, request: any) => removeNote(request, noteId)
  },
  updateNote: {
    type: NoteType,
    args: {
      note: { type: NoteInputType }
    },
    resolve: (obj: any, { note }: any, request: any) => updateNote(request, note)
  }
};

const subscription = {};

const NoteSchema = {
  query,
  mutation,
  subscription,
  types: [NoteType]
};

export default NoteSchema;