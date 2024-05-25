import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  checkIfUserAlearyExists,
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { refreshTokenValidator } from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
import SendApiResponse from "../utils/SendApiResponse";
import BusinessServices from "../services/businessServices";
import multerMiddleware from "../middlewares/multer";

const businessServices = new BusinessServices();
const businessRouter = Router();

businessRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  multerMiddleware.single("banner"),
  businessServices.CreateNewProfile
);
businessRouter.get(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBusinesses
);
businessRouter.get(
  "/:ownerId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBusinessById
);
businessRouter.put(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.UpdateBusiness
);
businessRouter.delete(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.DeletBusiness
);

//bill template
businessRouter.post(
  "/:businessId/templates",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.CreateTemplate
);
businessRouter.get(
  "/:businessId/templates",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillTemplates
);
businessRouter.get(
  "/:templateId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillTemplate
);
businessRouter.put(
  "/:templateId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.UpdateBillTemplate
);
businessRouter.delete(
  "/:templateId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.DeleteBillTemplate
);
export default businessRouter;
