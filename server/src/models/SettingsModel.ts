import { Logger } from '@overnightjs/logger';
import { model, Schema } from 'mongoose';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

export enum SearchEngineType {
  GOOGLE, DUCKDUCKGO, YAHOO, BING
}

export interface ISettings extends BaseTimeDocument {
  searchEngine: SearchEngineType;
  googleToken: string;
  backgroundImage: string;
}

export const SettingsSchema = new Schema({
  searchEngine: { type: SearchEngineType, default: SearchEngineType.GOOGLE },
  googleToken: { type: String, default: '' },
  backgroundImage: { type: String, default: '' },
  ...BaseTimeSchema
});

////// Create Model /////

const SettingsModel = model<ISettings>('Settings', SettingsSchema);
export default SettingsModel;

import UserModel from './UserModel';

async function getUserSettings(userId: Number) {
  const user = await UserModel.findById(userId);
  if (user) {
    return user.settings
  }
  Logger.Err("Recieved request from user " + userId + ", but wasnt found in DB");
  throw new Error('There was an error, please try again later.');
}

export async function getSettings(req: any) {
  if (req.user) {
    return await getUserSettings(req.user.id);
  }
  throw new Error('Please login first');
}

export async function updateSettings(req: any, input: ISettings) {
  if (req.user) {
    const userId = req.user.id;
    try {
      await UserModel.updateOne({ _id: userId }, { '$set': { 'settings': input } })
    } catch (err) {
      Logger.Err(err)
      throw new Error('There was an error, please try again later.');
    }
    return await getUserSettings(req.user.id);
  }
  throw new Error('Please login first');
}