import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  email: string
  password: string
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(this.password, salt)
  this.password = hash
  next()
})

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject()

  user.id = _id

  return user
}

export default model<IUser>('User', userSchema)
