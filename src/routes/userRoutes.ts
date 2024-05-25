import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { refreshTokenValidator } from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import SendApiResponse from "../utils/SendApiResponse";
import multerMiddleware from "../middlewares/multer";
const userServices = new UserServices();
const userRouter = Router();

userRouter.get(
  "/:uid",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetUserById
);
userRouter.put(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  multerMiddleware.single("photo"),
  userServices.UpdateUser
);
userRouter.delete(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.DeleteUser
);
userRouter.get(
  "/:uid/bills",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetBillHistory
);

export default userRouter;
