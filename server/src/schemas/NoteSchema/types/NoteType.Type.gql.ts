import {
  GraphQLEnumType
} from 'graphql';
import { NoteType as ModelNoteType } from '../../../models/NoteModel';

const NoteTypeType = new GraphQLEnumType({
  name: 'NoteType',
  values: {
    NOTE: { value: ModelNoteType.NOTE },
    TODO: { value: ModelNoteType.TODO }
  }
})

export default NoteTypeType;