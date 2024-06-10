import { body, header, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export const refreshTokenValidator = [
  body("refreshToken").exists().withMessage("Please provide proper content"),
];
interface IAuthorize {
  role: "customer" | "businessOwner" | "superUser";
}
export function authorize({ role }: IAuthorize) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Check if user has the required role
    if (req.payload?.role.find((v) => v === role)) {
      next();
    } else {
      next(createError.Forbidden("Not authorized user"))
    }
  };
}

export const validateRequestErrors = (req: Request, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    next(createError.NotAcceptable(errorMessage));
    return false;
  }
  return true;
};
