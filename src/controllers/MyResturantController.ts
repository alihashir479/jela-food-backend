import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Resturant from "../models/Resturant";
import mongoose from "mongoose";
import Order from "../models/Order";
const createMyResturant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const existingResturant = await Resturant.findOne({ user: req.userId });
    if (existingResturant) {
      return res.status(409).json({ message: "Resturant already exists" });
    }


    const resturant = new Resturant(req.body);
    resturant.imageUrl = await uploadImageToCloudinary(req.file as Express.Multer.File);
    resturant.user = new mongoose.Types.ObjectId(req.userId);
    resturant.lastUpdated = new Date();
    await resturant.save();

    res.status(201).json(resturant);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error creating resturant" });
  }
};

const getMyResturant = async (req: Request, res: Response): Promise<any> => {
  try {
    const resturant = await Resturant.findOne({ user: req.userId })
    if(!resturant) {
      return res.status(404).json({ message: 'Resturant not found'})
    }
    res.json(resturant)
  } catch(err) {
    res.status(500).json({ message: 'Error fetching resturant'})
  }
}

const updateMyResturant = async(req: Request, res: Response): Promise<any> => {
  try {
    const resturant = await Resturant.findOne({ user: req.userId})
    if(!resturant) {
      return res.status(404).json({ message: 'Resturant not found'})
    }

    resturant.resturantName = req.body.resturantName
    resturant.city = req.body.city
    resturant.country = req.body.country
    resturant.deliveryPrice = req.body.deliveryPrice
    resturant.estimatedDeliveryTime = req.body.estimatedDeliveryTime
    resturant.cuisines = req.body.cuisines
    resturant.menuItems = req.body.menuItems
    resturant.lastUpdated = new Date()

    if(req.file) {
      resturant.imageUrl = await uploadImageToCloudinary(req.file as Express.Multer.File)
    }

    await resturant.save()
    res.status(200).send(resturant)
  }
  catch(err) {
    res.status(500).json({ message: 'Error updating user'})
  }
}

const getMyResturantOrders = async (req: Request, res: Response):Promise<any> => {
  try {
    const resturant = await Resturant.findOne({ user: req.userId})
    if(!resturant) {
      return res.status(404).json({message: 'Resturant not found'})
    }
    const orders = await Order.find({ resturant: resturant.id}).populate('resturant').populate('user')
    res.json(orders)
  }
  catch(err) {
    res.status(500).json({message: 'Error getting my resturant orders!'})
  }
}

const updateOrderStatus = async (req: Request, res: Response):Promise<any> => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)
    if(!order) {
      return res.status(404).json({ message: 'Order not found'})
    }

    const resturant = await Resturant.findById(order.resturant)
    if(resturant && resturant.user?.toString() !== req.userId) {
      res.status(401).send()
    }

    order.status = status
    await order.save()
    res.status(200).json(order)
  }
  catch(err) {
    res.status(500).json({ message: 'Unable to update order status'})
  }
}

const uploadImageToCloudinary = async (file: Express.Multer.File) => {
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataUri = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);
  return uploadResponse.url
}

export { createMyResturant, getMyResturant, updateMyResturant, getMyResturantOrders, updateOrderStatus };
