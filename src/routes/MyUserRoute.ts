import express, { Request, Response } from "express";
import {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
} from "../controllers/MyUserController";
import { jwtCheck } from "../middleware/auth";
import { jwtParse } from "../middleware/jwtParse";
import { myUserRequestValidation } from "../middleware/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getCurrentUser);
router.post("/", jwtCheck, createCurrentUser);
router.put("/", jwtCheck, jwtParse, myUserRequestValidation, updateCurrentUser);

export default router;
