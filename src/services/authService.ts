import { Request, Response, NextFunction } from "express";
import AuthRepository from "../repositories/authRepository";
import UserRepository from "../repositories/userRepository";
import SendApiResponse from "../utils/SendApiResponse";
import { validationResult } from "express-validator";
import createError from "http-errors";
import {
  blacklistAccessToken,
  removeRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt_helper";
import UserModel from "../models/userModel";
import { validateRequestErrors } from "../utils/validators/validators";
import { getTokenFromHeader } from "../utils/validators/handlers";
import { IPayload } from "../middlewares/firebaseMiddleware";

export default class AuthServices {
  private authRepo: AuthRepository | null;
  private userRepo: UserRepository | null;
  constructor() {
    this.authRepo = new AuthRepository();
    this.userRepo = new UserRepository();
    this.firebaseSignup = this.firebaseSignup.bind(this);
    this.firebaseLogin = this.firebaseLogin.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
    this.logout = this.logout.bind(this);
  }

  async firebaseSignup(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const user = req?.firebaseUser;
      const createdUser = await this.authRepo!.createUser({
        user: user!,
        data: req.body,
      });
      return SendApiResponse(res, 201, createdUser);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async firebaseLogin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRequestErrors(req, next)) return;

      const user = req?.firebaseUser!;
      const fetchedUser = await this.authRepo!.getUserById(user?.uid);

      if (!fetchedUser) next(createError.NotFound());
      else {
        const accessToken = await signAccessToken({
          uid: user.uid,
          userdocId: fetchedUser._id,
          role: fetchedUser.role,
        });
        const refreshToken = await signRefreshToken({
          uid: user.uid,
          userdocId: fetchedUser._id,
          role: fetchedUser.role,
        });
        return SendApiResponse(res, 200, {
          accessToken,
          refreshToken,
        });
      }
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.payload as IPayload;
      const accessToken = await signAccessToken({
        uid: payload.uid,
        userdocId: payload.userdocId,
        role: payload.role,
      });
      const refreshToken = await signRefreshToken({
        uid: payload.uid,
        userdocId: payload.userdocId,
        role: payload.role,
      });
      return SendApiResponse(res, 200, {
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.payload as IPayload;
      const accessToken = getTokenFromHeader(req.headers.authorization);

      await removeRefreshToken({ userdocId: payload?.userdocId });
      await blacklistAccessToken(accessToken, 0);
      return SendApiResponse(res, 200, null);
    } catch (err) {
      next(createError.InternalServerError(`${err}`));
    }
  }
}
