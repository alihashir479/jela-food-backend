import { Request, Response } from "express";
import User from "../models/User";

export const createCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { auth0Id } = req.body
    const existingUser = await User.findOne({auth0Id})
    if (existingUser) {
      return res.status(200).send()
    }

    const newUser = new User(req.body)
    await newUser.save()
    return res.status(201).json(newUser.toObject())
  }
  catch (error) {
    res.status(500).json({message: 'Error creating user!'})
  } 
}

export const updateCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {

    const user = await User.findById(req.userId)
    if(!user) {
      return res.status(404).json({message: 'user not found!'})
    } 
    
    const { name, addressLine1, country, city} = req.body

    user.name = name
    user.addressLine1 = addressLine1
    user.country = country
    user.city = city

    await user.save()
    res.send(user)
  }

  catch(err) {
    res.status(500).json({message: 'Error updating user!'})
  }
}

type User = {
  _id: string;
  auth0Id: string;
  email: string;
  name: string;
  addressLine1: string;
  city: string;
  country: string;
}

export const getCurrentUser = async (req: Request, res: Response):Promise<any> => {
  try {
    const userId = req.userId
    const currentUser = await User.findOne({ _id: userId })
    if(!currentUser) {
      return res.status(404).json({ message: 'User not found'})
    }
    return res.status(200).json(currentUser)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({message: 'Error updating user'})
  }
}