import { NextFunction } from "express";
import { body, header, validationResult } from "express-validator";
import * as JWT from "jsonwebtoken";
import createError from "http-errors";

export const getTokenFromHeader = (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw new Error("Invalid authorization header format");
  }
  return token;
};

export const handleTokenError = (err: JWT.VerifyErrors | null, next: NextFunction) => {
  const msg = err?.name === "JsonWebTokenError" ? "Unauthorized" : err?.message;
  next(createError.Unauthorized(msg));
};
