import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import {
  authorize,
  refreshTokenValidator,
} from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import SendApiResponse from "../utils/SendApiResponse";
import multerMiddleware from "../middlewares/multer";
const userServices = new UserServices();
const userRouter = Router();

userRouter.get("/", userServices.SearchUsers);
userRouter.get(
  "/me",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetUser
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

userRouter.put(
  "/add-role",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  userServices.addUserRole
);

userRouter.delete(
  "/remove-role",
  bearerTokenValidator,
  verifyAccessToken,
  authorize({ role: "superUser" }),
  userServices.removeUserRole
);

userRouter.get(
  "/:userId",
  bearerTokenValidator,
  verifyAccessToken,
  userServices.GetUserById
);

// userRouter.get(
//   "/bills/me",
//   bearerTokenValidator,
//   verifyAccessToken,
//   userServices.GetBillHistory
// );

export default userRouter;
