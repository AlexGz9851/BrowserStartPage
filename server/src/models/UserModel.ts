import { Logger } from '@overnightjs/logger';
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { BaseTimeDocument, BaseTimeSchema } from './utils/ModelUtils';

const BCRYPT_SALT_WORK_FACTOR = 10;

export interface IUser extends BaseTimeDocument {
  username: string;
  password: string;
  comparePassword(password: string): boolean;
}

const UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
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

export function getUsers(limit = 100) {
  return UserModel.find().limit(limit);
}

export function getUserById(id: string) {
  return UserModel.findOne({ _id: id });
}

export function getUserByUsername(username: string) {
  return UserModel.findOne({ username });
}

export function addUser(input: IUser) {
  const rec = UserModel.create(input);
  Logger.Info(rec, true)
  return rec;
}

export function removeUser(id: string) {
  return UserModel.findByIdAndRemove(id);
}