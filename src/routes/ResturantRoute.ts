import express from "express";
import { param } from "express-validator";
import { searchResturant } from "../controllers/ResturantController";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid city name")
  ,
  searchResturant  
);

export default router;
