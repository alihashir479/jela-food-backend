import express from "express";
import { param } from "express-validator";
import {
  getResturant,
  searchResturant,
} from "../controllers/ResturantController";

const router = express.Router();

router.get(
  "/:resturantId",
  param("resturantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Resturant Id must be a valid string!"),
  getResturant
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid city name"),
  searchResturant
);

export default router;
