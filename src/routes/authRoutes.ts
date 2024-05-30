import express, { NextFunction, Router, Request, Response } from "express";
import AuthServices from "../services/authService";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { refreshTokenValidator } from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import SendApiResponse from "../utils/SendApiResponse";

const authServices = new AuthServices();
const authRouter = Router();

authRouter.post(
  "/firebase-signup",
  bearerTokenValidator,
  firebaseMiddleware,
  checkIfUserAlearyExists,
  authServices.firebaseSignup
);
authRouter.post(
  "/firebase-login",
  bearerTokenValidator,
  firebaseMiddleware,
  authServices.firebaseLogin
);
authRouter.post(
  "/refresh-tokens",
  refreshTokenValidator,
  verifyRefreshToken,
  authServices.refreshTokens
);
authRouter.post(
  "/logout",
  bearerTokenValidator,
  verifyAccessToken,
  authServices.logout
);

export default authRouter;
