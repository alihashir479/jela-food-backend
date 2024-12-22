import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export const myUserRequestValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Adress line 1 is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  body("city").isString().notEmpty().withMessage("City is required"),
  handleValidation,
];

export const validateMyResturantRequest = [
  body("resturantName").notEmpty().withMessage("Resturant name is required"),
  body("city").notEmpty().withMessage("City name is required"),
  body("country").notEmpty().withMessage("Country name is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time must be a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines must be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage('menuItems must be an array'),
  body('menuItems.*.name').notEmpty().withMessage('Menu item name cannot be empty'),
  body('menuItems.*.price').isFloat({min: 0}).withMessage('Menu item price must be a positive number'),
  handleValidation
];
