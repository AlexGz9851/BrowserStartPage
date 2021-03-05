import { model, Schema } from 'mongoose';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

export enum NoteType {
  NOTE, TODO
}

export interface INote extends BaseTimeDocument {
  id: string;
  type: NoteType;
  content: string;
}

const NoteSchema = new Schema({
  type: { type: NoteType, required: true },
  content: { type: String, required: true },
  ...BaseTimeSchema
});

const NoteModel = model<INote>('Note', NoteSchema);
export default NoteModel;

export function getNotes() {
  return NoteModel.find();
}

export function addNote(input: INote) {
  return NoteModel.create(input);
}

export function updateNote(input: INote) {
  return NoteModel.updateOne({ _id: input.id })
}

export function removeNote(id: string) {
  return NoteModel.findByIdAndRemove(id);
}