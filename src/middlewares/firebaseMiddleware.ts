import { Response, Request, NextFunction } from "express";

import createError from "http-errors";
import { body, header, validationResult } from "express-validator";
import firebaseAdminApp from "../config/firebaseSdkConfig";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import UserModel, { IUser } from "../models/userModel";

export const bearerTokenValidator = [
  header("authorization", "Authorization header is empty").exists(),
];

export const checkIfUserAlearyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = await UserModel.findOne({ uid: req.firebaseUser?.uid });
  if (userData)
    return next(createError.Conflict("User already exists please login"));
  else next();
};

export interface IPayload {
  uid: string;
  role: Array<String>;
  userdocId: string;
}
declare module "express-serve-static-core" {
  interface Request {
    payload?: IPayload;
    firebaseUser?: DecodedIdToken;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError.Unauthorized());
    }

    const { authorization } = req.headers;
    const [_, bearerToken] = authorization?.split(" ") || [];

    if (!bearerToken) {
      return next(createError.Unauthorized("Token not provided"));
    }

    try {
      const decodedUserInfo = await firebaseAdminApp
        .auth()
        .verifyIdToken(bearerToken);
      if (decodedUserInfo) {
        req.firebaseUser = decodedUserInfo;
        return next();
      } else {
        return next(createError.NotAcceptable());
      }
    } catch (error) {
      if ((error as any).code === "auth/id-token-expired"||(error as any).code === "auth/argument-error") {
        console.log("Token expired");
        return next(createError.Unauthorized("Token Expired"));
      } else {
        console.log(error)
        return next(createError.InternalServerError());
      }
    }
  } catch (err) {
    return next(err);
  }
};
