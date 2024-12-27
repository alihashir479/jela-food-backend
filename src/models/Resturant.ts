import mongoose, { InferSchemaType, mongo } from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId()},
  name: {type: String, required: true},
  price: {type: Number, required: true}
})

export type MenuItemType = InferSchemaType<typeof MenuItemSchema>

const ResturantScehma = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  resturantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  menuItems: [MenuItemSchema],
  cuisines: [{ type: String, required: true}],
  imageUrl: {type: String, required: true},
  lastUpdated: {type: Date, required: true}
});

const Resturant = mongoose.model('Resturant', ResturantScehma)
export default Resturant