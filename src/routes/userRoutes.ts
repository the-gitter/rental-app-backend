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
  "/me",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetUser
);
userRouter.get(
  "/:userId",
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
userRouter.post(
  "/address",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.CreateAddress
);
userRouter.put(
  "/address",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.UpdateAddress
);
userRouter.delete(
  "/address",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.DeleteAddress
);

userRouter.get(
  "/bills",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetBillHistory
);

export default userRouter;
