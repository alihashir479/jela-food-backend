import { Request, Response } from "express";
import Resturant, { MenuItemType } from "../models/Resturant";
import Stripe from "stripe";
import Order from "../models/Order";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET as string

type SessionRequestType = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  resturantId: string;
};
const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const sessionRequestData: SessionRequestType = req.body;
    const resturant = await Resturant.findById(sessionRequestData.resturantId);
    if (!resturant) {
      throw new Error("Resturant not found");
    }

    const newOrder = new Order({
      resturant: resturant,
      user: req.userId,
      cartItems: sessionRequestData.cartItems,
      deliveryDetails: sessionRequestData.deliveryDetails,
      status: 'placed',
      createdAt: new Date()
    })

    const lineItems = createLineItems(sessionRequestData, resturant.menuItems);
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      resturant.deliveryPrice,
      resturant._id.toString()
    );

    if (!session) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    await newOrder.save()

    res.json({ url: session.url });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.raw.message });
  }
};

const createLineItems = (
  sessionRequestData: SessionRequestType,
  menuItems: MenuItemType[]
) => {
  const lineItems = sessionRequestData.cartItems.map((currentCartItem) => {
    const menuItem = menuItems.find(
      (currentMenuItem) =>
        currentMenuItem._id.toString() === currentCartItem.menuItemId.toString()
    );
    if (!menuItem) {
      throw new Error(`Cannot find ${currentCartItem.menuItemId}`);
    }
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "USD",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(currentCartItem.quantity)
    };

    return lineItem;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  resturantId: string
) => {
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'delivery',
          type: "fixed_amount",
          fixed_amount: {
            currency: "USD",
            amount: deliveryPrice,
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      resturantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/resturant/detail/${resturantId}?=cancelled=true`,
  });

  return session;
};

const handleStripeWebook = async (req: Request, res: Response):Promise<any> => {
  let event;
  try {
    const sig = req.headers['stripe-signature'] as string
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET_KEY)
  }
  catch(err: any) {
    console.log(err)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(event.type === 'checkout.session.completed') {
    const order = await Order.findById(event.data.object.metadata?.orderId)

    if(!order) {
      return res.status(404).json({ message: 'Order not found'})
    }

    order.totalAmount = event.data.object.amount_total
    order.status = 'paid'

    await order.save()
  }
}

export { createCheckoutSession, handleStripeWebook };
