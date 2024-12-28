import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {

  const { authorization } = req.headers;
  if (!authorization || !(authorization as string).startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  try {
    const token = (authorization as string).split(" ")[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.sendStatus(401);
    }
    const userId = user._id;

    req.userId = userId.toString() as string;
    req.auth0Id = auth0Id as string;

    next();
  } catch (error) {
    console.log(error)
    return res.status(401);
  }
};
