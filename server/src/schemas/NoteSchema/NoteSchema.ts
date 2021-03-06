import { addNote } from "../../models/NoteModel";
import NoteInputType from "./types/NoteInputType.gql";
import NoteType from "./types/NoteType.gql";

const query = {};

const mutation = {
  addNote: {
    type: NoteType,
    args: {
      note: NoteInputType
    },
    resolve: (obj: any, { note }: any) => addNote(note)
  },
  removeNote: {},
  updateNote: {}
};

const subscription = {};

const UserSchema = {
  query,
  mutation,
  subscription,
  types: [NoteType]
};

export default UserSchema;