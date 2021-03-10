import { model, Schema, Types } from 'mongoose';
import UserModel from './UserModel';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

export enum NoteType {
  NOTE, TODO
}

export interface INote extends BaseTimeDocument {
  _id: Types.ObjectId | null;
  type: NoteType;
  title: string;
  content: string;
}

export const NoteSchema = new Schema({
  type: { type: NoteType, required: true, default: NoteType.NOTE },
  content: { type: String, required: true, default: "" },
  title: { type: String, required: true, default: "" },
  ...BaseTimeSchema
});

const NoteModel = model<INote>('Note', NoteSchema);
export default NoteModel;

export async function getNotes(req: any) {
  if (req.user) {
    const userId = req.user.id;
    return (await UserModel.findById(userId))!.notes
  }
  throw new Error("Please login first");
}

export async function getNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    const userId = req.user.id;
    const note = await UserModel.findOne({ _id: userId });
    return note?.notes.find(note => note.id === id)
  }
  throw new Error("Please login first");
}

export async function addNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    input._id = Types.ObjectId();
    await UserModel.updateOne({ _id: userId }, { "$push": { "notes": input } })
    return input;
  }
  throw new Error("Please login first");
}

export async function updateNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    return input
  }
  throw new Error("Please login first");
}

export async function removeNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    const note = await getNote(req, id);
    const userId = req.user.id;
    await UserModel.updateOne({ _id: userId }, { "$pull": { "notes": { _id: id } } })
    return note
  }
  throw new Error("Please login first");
}