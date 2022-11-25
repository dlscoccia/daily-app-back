import { Request, Response } from 'express'
import User, { IUser } from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config/config'

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.JWTSecret, {
    expiresIn: 86400,
  })
}

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.body)
  const { email, password, firstName, lastName } = req.body

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      msg: 'Fields are required',
    })
  }

  const user = await User.findOne({ email: email })

  if (user) {
    return res.status(400).json({ msg: 'The user already exists' })
  }

  const newUser = new User({ email, password, firstName, lastName })
  await newUser.save()

  return res.status(201).json(newUser)
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  console.log(email)
  if (!email || !password) {
    return res.status(400).json({
      msg: 'Fields are required',
    })
  }

  const user = await User.findOne({ email })
  console.log(user)
  if (!user) {
    return res.status(400).json({ msg: 'This user does not exists' })
  }

  const isMatch = await user.comparePassword(password)
  if (isMatch) {
    return res.status(200).json({ user, token: createToken(user) })
  }

  return res.status(400).json({
    msg: 'Email/Password does not match',
  })
}
