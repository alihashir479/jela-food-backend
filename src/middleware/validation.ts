import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }
  return next()
}

export const myUserRequestValidation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('addressLine1').isString().notEmpty().withMessage('Adress line 1 is required'),
  body('country').isString().notEmpty().withMessage('Country is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  handleValidation
]