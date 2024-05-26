import JWT from "jsonwebtoken";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";
// import redisClient from "./init_redis";
import { validationResult } from "express-validator";
import { validateRequestErrors } from "./validators/validators";
import { getTokenFromHeader, handleTokenError } from "./validators/handlers";
import {
  AccessTokenModel,
  RefreshTokenModel,
} from "../models/tokenManagementModels";
import { IPayload } from "../middlewares/firebaseMiddleware";

export const signAccessToken = async (payload: IPayload) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30 days",
      issuer: "thegitter.com",
      audience: payload.uid,
    };

    return JWT.sign(payload, secret!, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};
export const signRefreshToken = (payload: IPayload) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "365 days",
      issuer: "thegitter.com",
      audience: payload.uid,
    };
    return JWT.sign(payload, secret!, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000 * 365); // 365 days

      await new RefreshTokenModel({
        token,
        userdocId: payload.userdocId,
        expiresAt,
      }).save();

      resolve(token);
    });
  });
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!validateRequestErrors(req, next)) return;

  try {
    const token = getTokenFromHeader(req.headers.authorization);
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      return next(
        createError.InternalServerError("Access token secret is not defined")
      );
    }

    const blacklisted = await isAccessTokenBlacklisted(token);
    if (blacklisted) {
      return next(createError.Unauthorized("Token has been blacklisted"));
    }

    JWT.verify(
      token,
      secret,
      (
        err: JWT.VerifyErrors | null,
        payload: string | JWT.JwtPayload | undefined
      ) => {
        if (err) {
          return handleTokenError(err, next);
        }
        req.payload = payload as IPayload;
        next();
      }
    );
  } catch (error) {
    next(createError.Unauthorized(`${error}`));
  }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!validateRequestErrors(req, next)) return;

  const { refreshToken } = req.body;
  const secret = process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    return next(
      createError.InternalServerError("Refresh token secret is not defined")
    );
  }

  try {
    JWT.verify(
      refreshToken,
      secret,
      async (
        err: JWT.VerifyErrors | null,
        payload: string | JWT.JwtPayload | undefined
      ) => {
        if (err) {
          return handleTokenError(err, next);
        }

        const _pay = payload as IPayload;

        try {
          const storedToken = await RefreshTokenModel.findOne({
            userdocId: _pay.userdocId,
          });
         
          if (refreshToken === storedToken?.token) {
            
            req.payload= _pay
            next();
          } else {
            next(createError.Unauthorized("Invalid refresh token"));
          }
        } catch (redisError) {
          next(createError.InternalServerError("Redis error: " + redisError));
        }
      }
    );
  } catch (error) {
    next(createError.InternalServerError(`${error}`));
  }
};

export const removeRefreshToken = async ({
  userdocId,
}: {
  userdocId: string;
}) => {
  await RefreshTokenModel.findOneAndDelete({ userdocId });
};

// black listing tokens
export const blacklistAccessToken = async (
  token: string,
  expiration: number
) => {
  const blacklistedToken = new AccessTokenModel({ token });
  return !!blacklistedToken;
};

export const isAccessTokenBlacklisted = (token: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await AccessTokenModel.findOne({ token });
      if (result) resolve(true);
      else resolve(false);
    } catch (err) {
      reject(err);
    }
  });
};
