import express, { NextFunction, Router, Request, Response } from "express";
import UserServices from "../services/userServices";
import firebaseMiddleware, {
  bearerTokenValidator,
} from "../middlewares/firebaseMiddleware";
import { refreshTokenValidator } from "../utils/validators/validators";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt_helper";
 
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
  "/me",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillsForCustomer
);

billsRouter.get(
  "/business/:businessId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillsForBusiness
);

billsRouter.get(
  "/:billId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.GetBillById
);

billsRouter.put(
  "/:billId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.UpdateBill
);

// billsRouter.delete(
//   "/:templateId",
//   bearerTokenValidator,
//   verifyAccessToken,
//   businessServices.DeleteBill
// );

billsRouter.post(
  "/:customerId/send/:billId",
  bearerTokenValidator,
  verifyAccessToken,
  businessServices.SendCustomerBillAsNotification
);

export default billsRouter;
