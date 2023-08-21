import { model, Schema } from 'mongoose'

export interface IUser {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  isDeleted: boolean
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false, required: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

export default model<IUser>('User', userSchema)

/*

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false, required: false },
  isDeleted: { type: Boolean, default: false }
}, { collection: 'users' })

module.exports =  mongoose.model('User', UserSchema)

*/