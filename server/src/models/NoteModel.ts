import { model, Schema, Types } from 'mongoose';
import UserModel from './UserModel';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

export enum NoteType {
  NOTE, TODO
}

export interface IToDo extends Document {
  content: string,
  done: boolean
}

export interface INote extends BaseTimeDocument {
  _id: Types.ObjectId | null;
  type: NoteType;
  title: string;
  content: string;
  todo: IToDo[];
  posX: string;
  posY: string;
}

export const ToDoSchema = new Schema({
  content: { type: String, required: true, default: '' },
  done: { type: Boolean, required: true, default: false },
})

export const NoteSchema = new Schema({
  type: { type: NoteType, required: true, default: NoteType.NOTE },
  content: { type: String },
  title: { type: String, required: true, default: '' },
  todo: { type: [ToDoSchema] },
  posX: { type: String, required: true, default: '0px' },
  posY: { type: String, required: true, default: '0px' },
  ...BaseTimeSchema
});

const NoteModel = model<INote>('Note', NoteSchema);
export default NoteModel;

export async function getNotes(req: any) {
  if (req.user) {
    const userId = req.user.id;
    return (await UserModel.findById(userId))!.notes
  }
  throw new Error('Please login first');
}

export async function getNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    const userId = req.user.id;
    const user = await UserModel.findOne({ _id: userId });
    return user?.notes.find(note => note._id?.equals(id));
  }
  throw new Error('Please login first');
}

export async function addNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    const note = await NoteModel.create(input)
    await UserModel.updateOne({ _id: userId }, { '$push': { 'notes': note } })
    await NoteModel.findByIdAndRemove(note._id, { useFindAndModify: true });
    return note;
  }
  throw new Error('Please login first');
}

export async function updateNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    for (const [key, value] of Object.entries(input)) {
      if (key === '_id') { continue }
      const setKey = 'notes.$.' + key
      await UserModel.updateOne(
        { _id: userId, 'notes._id': input._id },
        { '$set': { [setKey]: value } }
      )
    }
    return await getNote(req, input._id!);
  }
  throw new Error('Please login first');
}

export async function removeNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    const userId = req.user.id;
    const note = await getNote(req, id);
    await UserModel.updateOne({ _id: userId }, { '$pull': { 'notes': { _id: id } } })
    return note
  }
  throw new Error('Please login first');
}