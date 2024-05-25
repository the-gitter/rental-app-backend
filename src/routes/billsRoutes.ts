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
import BillServices from "../services/BillServices";

const businessServices = new BillServices();
const billsRouter = Router();

billsRouter.post(
  "/",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.CreateBill
);
billsRouter.get(
  "/customer",
  bearerTokenValidator,
  businessServices.GetBillsForCustomer
);
billsRouter.get(
  "/:businessId",
  bearerTokenValidator,
  businessServices.GetBillsForBusiness
);

billsRouter.get(
  "/:billId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillById
);

billsRouter.put(
  "/:templateId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.UpdateBillTemplate
);

billsRouter.delete(
  "/:templateId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.DeleteBillTemplate
);

billsRouter.post(
  "/:customerId/send/:billId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.SendCustomerBill
);

export default billsRouter;
