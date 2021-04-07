import { Logger } from '@overnightjs/logger';
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
  width: string;
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
  width: { type: String, required: true, default: '' },
  ...BaseTimeSchema
});

const NoteModel = model<INote>('Note', NoteSchema);
export default NoteModel;

async function getUserNotes(userId: Number) {
  const user = await UserModel.findById(userId);
  if (user) {
    return user.notes
  }
  Logger.Err("Recieved request from user " + userId + ", but wasnt found in DB");
  throw new Error('There was an error, please try again later.');
}


export async function getNotes(req: any) {
  if (req.user) {
    return await getUserNotes(req.user.id);
  }
  throw new Error('Please login first');
}

export async function getNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    return (await getUserNotes(req.user.id)).find(note => note._id?.equals(id));
  }
  throw new Error('Please login first');
}

export async function addNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    const note = new NoteModel(input)
    try {
      await UserModel.updateOne({ _id: userId }, { '$push': { 'notes': note } })
    } catch (err) {
      Logger.Err(err)
      throw new Error("There was a problem creating the note, please try again")
    }
    return note;
  }
  throw new Error('Please login first');
}

export async function updateNote(req: any, input: INote) {
  if (req.user) {
    const userId = req.user.id;
    let noteId = input._id instanceof Types.ObjectId ? input._id :
      Types.ObjectId(input._id as any);
    let failed = false;
    for (const [key, value] of Object.entries(input)) {
      if (key === "_id") { continue }
      const setKey = "notes.$." + key
      try {
        await UserModel.updateOne(
          { _id: userId, "notes._id": noteId },
          { "$set": { [setKey]: value } }
        )
      } catch (err) {
        Logger.Err(err)
        failed = true;
      }
    }
    if (failed) {
      throw new Error("There was a problem updating the note, please try again")
    }
    return await getNote(req, noteId!);
  }
  throw new Error('Please login first');
}

export async function removeNote(req: any, id: Types.ObjectId) {
  if (req.user) {
    const userId = req.user.id;
    const note = await getNote(req, id);
    try {
      await UserModel.updateOne(
        { _id: userId },
        { '$pull': { 'notes': { _id: note!._id } } }
      )
    } catch (err) {
      Logger.Err(err)
      throw new Error("There was a problem removing the note, please try again")
    }
    return note
  }
  throw new Error('Please login first');
}