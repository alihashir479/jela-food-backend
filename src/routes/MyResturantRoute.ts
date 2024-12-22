import express from "express";
import { createMyResturant, getMyResturant, updateMyResturant } from "../controllers/MyResturantController";
import multer from "multer";
import { jwtCheck } from "../middleware/auth";
import { jwtParse } from "../middleware/jwtParse";
import { validateMyResturantRequest } from "../middleware/validation";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/', jwtCheck, jwtParse, getMyResturant)
router.post(
  "/",
  upload.single("imageFile"),
  validateMyResturantRequest,
  jwtCheck,
  jwtParse,
  createMyResturant
);
router.put(
  "/",
  upload.single("imageFile"),
  validateMyResturantRequest,
  jwtCheck,
  jwtParse,
  updateMyResturant
);
export default router;
