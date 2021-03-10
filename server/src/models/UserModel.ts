import { Logger } from '@overnightjs/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';
import { INote, NoteSchema } from './NoteModel';
import SettingsModel, { SettingsSchema, ISettings } from './SettingsModel';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

const BCRYPT_SALT_WORK_FACTOR = 10;

export interface IUser extends BaseTimeDocument {
  username: string;
  password: string;
  comparePassword(password: string): boolean;
  settings: ISettings;
  notes: Array<INote>;
}

const UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  settings: { type: SettingsSchema },
  notes: { type: [NoteSchema], default: [] },
  ...BaseTimeSchema
});

// Use bcrypt to has the user password in the DB
UserSchema.pre('save', function preSaveAddPasswordHash(next) {
  const user = this as IUser;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(BCRYPT_SALT_WORK_FACTOR, (errorSalt, salt) => {
    if (errorSalt) {
      return next(errorSalt);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, (errorHash, hash) => {
      if (errorHash) {
        return next(errorHash);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const user = this as IUser;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

////// Create Model /////

const UserModel = model<IUser>('User', UserSchema);
export default UserModel;

////// Functions ////////

export async function login(username: string, password: string) {
  const candidateUser = await UserModel.findOne({ username });
  if (!candidateUser) {
    throw new Error("User not found, please verify the username or password")
  }
  const match = await candidateUser.comparePassword(password)
  if (match) {
    const token = jwt.sign(
      { id: candidateUser._id }, process.env.JWT_KEY!, { expiresIn: "365d" });
    return {
      user: candidateUser,
      jwt: token
    }
  } else {
    throw new Error("User not found, please verify the username or password")
  }
}

export async function signUp(input: IUser) {
  const newSettings = await SettingsModel.create({});
  input.settings = newSettings;
  const newUser = await UserModel.create(input);
  const token = jwt.sign(
    { id: newUser._id }, process.env.JWT_KEY!, { expiresIn: "365d" })
  return {
    user: newUser,
    jwt: token
  }
}