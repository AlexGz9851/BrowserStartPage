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
  googleToken: { type: String, default: "" },
  backgroundImage: { type: String, default: "" },
  ...BaseTimeSchema
});

////// Create Model /////

const SettingsModel = model<ISettings>('Settings', SettingsSchema);
export default SettingsModel;

import UserModel from './UserModel';
export async function updateSettings(req: any, input: ISettings) {
  if (req.user) {
    const userId = req.user.id;
    await UserModel.updateOne({ _id: userId }, { "$set": { "settings": input } })
    return (await UserModel.findById(userId))!.settings
  }
  throw new Error("Please login first");
}