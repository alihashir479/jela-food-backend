import mongoose, { mongo } from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true}
})

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