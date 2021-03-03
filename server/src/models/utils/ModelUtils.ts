import { Logger } from '@overnightjs/logger';
import { Document, NativeError } from 'mongoose';

export interface BaseTimeDocument extends Document {
  createdAt: Date;
  updateAt: Date;
}

export const BaseTimeSchema = {
  createdAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: new Date() },
}
